package com.lifestyle.products.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, unique = true, nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private ERole name;

    // Default Constructor
    public Role() {
    }

    // All Arguments Constructor
    public Role(Integer id, ERole name) {
        this.id = id;
        this.name = name;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }

    // Standard toString method
    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", name=" + name +
                '}';
    }

    // Explicit Builder Implementation
    public static RoleBuilder builder() {
        return new RoleBuilder();
    }

    public static class RoleBuilder {
        private Integer id;
        private ERole name;

        public RoleBuilder id(Integer id) {
            this.id = id;
            return this;
        }

        public RoleBuilder name(ERole name) {
            this.name = name;
            return this;
        }

        public Role build() {
            return new Role(this.id, this.name);
        }
    }
}
