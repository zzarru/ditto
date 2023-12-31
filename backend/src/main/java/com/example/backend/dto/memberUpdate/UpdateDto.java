package com.example.backend.dto.memberUpdate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class UpdateDto {

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class Request {
    private String nickname;
    private Integer characterId;
    private String status;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class Response {
    private String nickname;
    private Integer characterId;
    private Long statusId;
    private String status;
    private String emotion;
  }
}
