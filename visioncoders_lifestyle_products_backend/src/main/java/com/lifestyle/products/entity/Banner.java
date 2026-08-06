package com.lifestyle.products.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "banners")
public class Banner extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(name = "image_url", nullable = false, length = 255)
    private String imageUrl;

    @Column(name = "link_url", length = 255)
    private String linkUrl;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    // Constructors
    public Banner() {
    }

    public Banner(Long id, String title, String imageUrl, String linkUrl, Integer displayOrder) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.linkUrl = linkUrl;
        this.displayOrder = displayOrder != null ? displayOrder : 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getLinkUrl() {
        return linkUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    // Builder Implementation
    public static BannerBuilder builder() {
        return new BannerBuilder();
    }

    public static class BannerBuilder {
        private Long id;
        private String title;
        private String imageUrl;
        private String linkUrl;
        private Integer displayOrder = 0;

        public BannerBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BannerBuilder title(String title) {
            this.title = title;
            return this;
        }

        public BannerBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public BannerBuilder linkUrl(String linkUrl) {
            this.linkUrl = linkUrl;
            return this;
        }

        public BannerBuilder displayOrder(Integer displayOrder) {
            this.displayOrder = displayOrder;
            return this;
        }

        public Banner build() {
            return new Banner(id, title, imageUrl, linkUrl, displayOrder);
        }
    }
}
