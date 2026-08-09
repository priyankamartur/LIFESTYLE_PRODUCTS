package com.lifestyle.products.service;

import com.lifestyle.products.dto.CheckoutRequestDto;
import com.lifestyle.products.dto.OrderResponseDto;
import com.lifestyle.products.dto.RazorpayOrderRequest;
import com.lifestyle.products.dto.RazorpayOrderResponse;
import com.lifestyle.products.dto.RazorpayVerifyRequest;
import com.lifestyle.products.entity.Order;
import com.lifestyle.products.entity.OrderStatus;
import com.lifestyle.products.entity.Payment;
import com.lifestyle.products.entity.PaymentStatus;
import com.lifestyle.products.exception.ApiException;
import com.lifestyle.products.repository.OrderRepository;
import com.lifestyle.products.repository.PaymentRepository;
import com.lifestyle.products.repository.UserRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class RazorpayPaymentService {

    @Value("${razorpay.key.id:rzp_test_TLKKx1wzFP5anv}")
    private String keyId;

    @Value("${razorpay.key.secret:5cahiulX4jogIDzsTE0GNe3r}")
    private String keySecret;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderService orderService;

    /**
     * Creates a new Razorpay Order with the given amount (converted to paise).
     */
    public RazorpayOrderResponse createRazorpayOrder(RazorpayOrderRequest request) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);

            // Amount converted into paise before creating order
            int amountInPaise = request.getAmount().multiply(BigDecimal.valueOf(100)).intValue();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            return RazorpayOrderResponse.builder()
                    .orderId((String) razorpayOrder.get("id"))
                    .amount(request.getAmount())
                    .currency("INR")
                    .key(keyId)
                    .build();
        } catch (RazorpayException e) {
            throw new ApiException("Razorpay Order creation failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Verifies the Razorpay signature and updates/creates the database order and payment records.
     */
    @Transactional
    public OrderResponseDto verifyPayment(String username, RazorpayVerifyRequest request) {
        boolean isSignatureValid = false;
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            isSignatureValid = Utils.verifyPaymentSignature(options, keySecret);
        } catch (Exception e) {
            // Log signature error
            System.err.println("Razorpay signature verification error: " + e.getMessage());
        }

        // If verification fails, throw error and update order status to CANCELLED (as PAYMENT_FAILED map)
        if (!isSignatureValid) {
            if (request.getOrderId() != null) {
                Order order = orderRepository.findById(request.getOrderId()).orElse(null);
                if (order != null) {
                    order.setStatus(OrderStatus.CANCELLED);
                    orderRepository.save(order);

                    Payment payment = Payment.builder()
                            .order(order)
                            .transactionId("FAIL-" + request.getRazorpayPaymentId())
                            .amount(order.getTotalAmount())
                            .paymentMethod("RAZORPAY")
                            .paymentStatus(PaymentStatus.FAILED)
                            .paymentDate(LocalDateTime.now())
                            .build();
                    paymentRepository.save(payment);
                }
            }
            throw new ApiException("Razorpay signature verification failed. Unauthorized transaction.", HttpStatus.BAD_REQUEST);
        }

        // Verification succeeded - process order update or creation
        Order order;
        if (request.getOrderId() != null) {
            order = orderRepository.findById(request.getOrderId())
                    .orElseThrow(() -> new ApiException("Order not found with ID: " + request.getOrderId(), HttpStatus.NOT_FOUND));
        } else {
            // Create Order if not already created
            String address = request.getShippingAddress() != null ? request.getShippingAddress() : "Standard Delivery Address";
            CheckoutRequestDto checkoutDto = new CheckoutRequestDto();
            checkoutDto.setShippingAddress(address);
            // This clears the user's cart automatically
            orderService.checkout(username, checkoutDto);
            
            // Fetch the newly created order
            order = orderRepository.findByUserUsernameOrderByOrderDateDesc(username).stream().findFirst()
                    .orElseThrow(() -> new ApiException("Failed to locate created order for user: " + username, HttpStatus.INTERNAL_SERVER_ERROR));
        }

        // Update Order Status to PROCESSING (Maps to PAID/SUCCESS in strict enum database)
        order.setStatus(OrderStatus.PROCESSING);
        Order savedOrder = orderRepository.save(order);

        // Save Payment details
        Payment payment = Payment.builder()
                .order(savedOrder)
                .transactionId(request.getRazorpayPaymentId())
                .amount(savedOrder.getTotalAmount())
                .paymentMethod("RAZORPAY")
                .paymentStatus(PaymentStatus.COMPLETED)
                .paymentDate(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        // Return order dto details
        return OrderResponseDto.builder()
                .id(savedOrder.getId())
                .orderDate(savedOrder.getOrderDate())
                .status(savedOrder.getStatus().name())
                .totalAmount(savedOrder.getTotalAmount())
                .shippingAddress(savedOrder.getShippingAddress())
                .build();
    }
}
