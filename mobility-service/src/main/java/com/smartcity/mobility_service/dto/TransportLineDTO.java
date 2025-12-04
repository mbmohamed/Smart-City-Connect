package com.smartcity.mobility_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportLineDTO {
    private Long id;
    private String name;
    private String type;
    private String status;
}
