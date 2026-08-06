package com.lifestyle.products.dto;

import java.util.List;

public class PagedResponseDto<T> {
    private List<T> content;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;

    // No-args constructor
    public PagedResponseDto() {
    }

    // All-args constructor
    public PagedResponseDto(List<T> content, int pageNo, int pageSize, long totalElements, int totalPages, boolean last) {
        this.content = content;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.last = last;
    }

    // Getters and Setters
    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    public int getPageNo() {
        return pageNo;
    }

    public void setPageNo(int pageNo) {
        this.pageNo = pageNo;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public boolean isLast() {
        return last;
    }

    public void setLast(boolean last) {
        this.last = last;
    }

    // Builder Pattern
    public static <T> PagedResponseDtoBuilder<T> builder() {
        return new PagedResponseDtoBuilder<>();
    }

    public static class PagedResponseDtoBuilder<T> {
        private List<T> content;
        private int pageNo;
        private int pageSize;
        private long totalElements;
        private int totalPages;
        private boolean last;

        public PagedResponseDtoBuilder<T> content(List<T> content) {
            this.content = content;
            return this;
        }

        public PagedResponseDtoBuilder<T> pageNo(int pageNo) {
            this.pageNo = pageNo;
            return this;
        }

        public PagedResponseDtoBuilder<T> pageSize(int pageSize) {
            this.pageSize = pageSize;
            return this;
        }

        public PagedResponseDtoBuilder<T> totalElements(long totalElements) {
            this.totalElements = totalElements;
            return this;
        }

        public PagedResponseDtoBuilder<T> totalPages(int totalPages) {
            this.totalPages = totalPages;
            return this;
        }

        public PagedResponseDtoBuilder<T> last(boolean last) {
            this.last = last;
            return this;
        }

        public PagedResponseDto<T> build() {
            return new PagedResponseDto<>(content, pageNo, pageSize, totalElements, totalPages, last);
        }
    }
}
