package com.smartcity.emergency_service.grpc;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * Service principal d'urgence
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.60.1)",
    comments = "Source: emergency.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class EmergencyServiceGrpc {

  private EmergencyServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "smartcity.emergency.EmergencyService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.CreateAlertRequest,
      com.smartcity.emergency_service.grpc.AlertResponse> getCreateAlertMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateAlert",
      requestType = com.smartcity.emergency_service.grpc.CreateAlertRequest.class,
      responseType = com.smartcity.emergency_service.grpc.AlertResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.CreateAlertRequest,
      com.smartcity.emergency_service.grpc.AlertResponse> getCreateAlertMethod() {
    io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.CreateAlertRequest, com.smartcity.emergency_service.grpc.AlertResponse> getCreateAlertMethod;
    if ((getCreateAlertMethod = EmergencyServiceGrpc.getCreateAlertMethod) == null) {
      synchronized (EmergencyServiceGrpc.class) {
        if ((getCreateAlertMethod = EmergencyServiceGrpc.getCreateAlertMethod) == null) {
          EmergencyServiceGrpc.getCreateAlertMethod = getCreateAlertMethod =
              io.grpc.MethodDescriptor.<com.smartcity.emergency_service.grpc.CreateAlertRequest, com.smartcity.emergency_service.grpc.AlertResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateAlert"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.smartcity.emergency_service.grpc.CreateAlertRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.smartcity.emergency_service.grpc.AlertResponse.getDefaultInstance()))
              .setSchemaDescriptor(new EmergencyServiceMethodDescriptorSupplier("CreateAlert"))
              .build();
        }
      }
    }
    return getCreateAlertMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.GetAlertRequest,
      com.smartcity.emergency_service.grpc.AlertResponse> getGetAlertStatusMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetAlertStatus",
      requestType = com.smartcity.emergency_service.grpc.GetAlertRequest.class,
      responseType = com.smartcity.emergency_service.grpc.AlertResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.GetAlertRequest,
      com.smartcity.emergency_service.grpc.AlertResponse> getGetAlertStatusMethod() {
    io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.GetAlertRequest, com.smartcity.emergency_service.grpc.AlertResponse> getGetAlertStatusMethod;
    if ((getGetAlertStatusMethod = EmergencyServiceGrpc.getGetAlertStatusMethod) == null) {
      synchronized (EmergencyServiceGrpc.class) {
        if ((getGetAlertStatusMethod = EmergencyServiceGrpc.getGetAlertStatusMethod) == null) {
          EmergencyServiceGrpc.getGetAlertStatusMethod = getGetAlertStatusMethod =
              io.grpc.MethodDescriptor.<com.smartcity.emergency_service.grpc.GetAlertRequest, com.smartcity.emergency_service.grpc.AlertResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetAlertStatus"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.smartcity.emergency_service.grpc.GetAlertRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.smartcity.emergency_service.grpc.AlertResponse.getDefaultInstance()))
              .setSchemaDescriptor(new EmergencyServiceMethodDescriptorSupplier("GetAlertStatus"))
              .build();
        }
      }
    }
    return getGetAlertStatusMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.UpdateAlertRequest,
      com.smartcity.emergency_service.grpc.AlertResponse> getUpdateAlertStatusMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UpdateAlertStatus",
      requestType = com.smartcity.emergency_service.grpc.UpdateAlertRequest.class,
      responseType = com.smartcity.emergency_service.grpc.AlertResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.UpdateAlertRequest,
      com.smartcity.emergency_service.grpc.AlertResponse> getUpdateAlertStatusMethod() {
    io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.UpdateAlertRequest, com.smartcity.emergency_service.grpc.AlertResponse> getUpdateAlertStatusMethod;
    if ((getUpdateAlertStatusMethod = EmergencyServiceGrpc.getUpdateAlertStatusMethod) == null) {
      synchronized (EmergencyServiceGrpc.class) {
        if ((getUpdateAlertStatusMethod = EmergencyServiceGrpc.getUpdateAlertStatusMethod) == null) {
          EmergencyServiceGrpc.getUpdateAlertStatusMethod = getUpdateAlertStatusMethod =
              io.grpc.MethodDescriptor.<com.smartcity.emergency_service.grpc.UpdateAlertRequest, com.smartcity.emergency_service.grpc.AlertResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UpdateAlertStatus"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.smartcity.emergency_service.grpc.UpdateAlertRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.smartcity.emergency_service.grpc.AlertResponse.getDefaultInstance()))
              .setSchemaDescriptor(new EmergencyServiceMethodDescriptorSupplier("UpdateAlertStatus"))
              .build();
        }
      }
    }
    return getUpdateAlertStatusMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.StreamAlertsRequest,
      com.smartcity.emergency_service.grpc.AlertResponse> getStreamAlertsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "StreamAlerts",
      requestType = com.smartcity.emergency_service.grpc.StreamAlertsRequest.class,
      responseType = com.smartcity.emergency_service.grpc.AlertResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.SERVER_STREAMING)
  public static io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.StreamAlertsRequest,
      com.smartcity.emergency_service.grpc.AlertResponse> getStreamAlertsMethod() {
    io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.StreamAlertsRequest, com.smartcity.emergency_service.grpc.AlertResponse> getStreamAlertsMethod;
    if ((getStreamAlertsMethod = EmergencyServiceGrpc.getStreamAlertsMethod) == null) {
      synchronized (EmergencyServiceGrpc.class) {
        if ((getStreamAlertsMethod = EmergencyServiceGrpc.getStreamAlertsMethod) == null) {
          EmergencyServiceGrpc.getStreamAlertsMethod = getStreamAlertsMethod =
              io.grpc.MethodDescriptor.<com.smartcity.emergency_service.grpc.StreamAlertsRequest, com.smartcity.emergency_service.grpc.AlertResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.SERVER_STREAMING)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "StreamAlerts"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.smartcity.emergency_service.grpc.StreamAlertsRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.smartcity.emergency_service.grpc.AlertResponse.getDefaultInstance()))
              .setSchemaDescriptor(new EmergencyServiceMethodDescriptorSupplier("StreamAlerts"))
              .build();
        }
      }
    }
    return getStreamAlertsMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.ResourceRequest,
      com.smartcity.emergency_service.grpc.ResourceResponse> getGetAvailableResourcesMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetAvailableResources",
      requestType = com.smartcity.emergency_service.grpc.ResourceRequest.class,
      responseType = com.smartcity.emergency_service.grpc.ResourceResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.ResourceRequest,
      com.smartcity.emergency_service.grpc.ResourceResponse> getGetAvailableResourcesMethod() {
    io.grpc.MethodDescriptor<com.smartcity.emergency_service.grpc.ResourceRequest, com.smartcity.emergency_service.grpc.ResourceResponse> getGetAvailableResourcesMethod;
    if ((getGetAvailableResourcesMethod = EmergencyServiceGrpc.getGetAvailableResourcesMethod) == null) {
      synchronized (EmergencyServiceGrpc.class) {
        if ((getGetAvailableResourcesMethod = EmergencyServiceGrpc.getGetAvailableResourcesMethod) == null) {
          EmergencyServiceGrpc.getGetAvailableResourcesMethod = getGetAvailableResourcesMethod =
              io.grpc.MethodDescriptor.<com.smartcity.emergency_service.grpc.ResourceRequest, com.smartcity.emergency_service.grpc.ResourceResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetAvailableResources"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.smartcity.emergency_service.grpc.ResourceRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.smartcity.emergency_service.grpc.ResourceResponse.getDefaultInstance()))
              .setSchemaDescriptor(new EmergencyServiceMethodDescriptorSupplier("GetAvailableResources"))
              .build();
        }
      }
    }
    return getGetAvailableResourcesMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static EmergencyServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<EmergencyServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<EmergencyServiceStub>() {
        @java.lang.Override
        public EmergencyServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new EmergencyServiceStub(channel, callOptions);
        }
      };
    return EmergencyServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static EmergencyServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<EmergencyServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<EmergencyServiceBlockingStub>() {
        @java.lang.Override
        public EmergencyServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new EmergencyServiceBlockingStub(channel, callOptions);
        }
      };
    return EmergencyServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static EmergencyServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<EmergencyServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<EmergencyServiceFutureStub>() {
        @java.lang.Override
        public EmergencyServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new EmergencyServiceFutureStub(channel, callOptions);
        }
      };
    return EmergencyServiceFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * Service principal d'urgence
   * </pre>
   */
  public interface AsyncService {

    /**
     * <pre>
     * Créer une alerte d'urgence
     * </pre>
     */
    default void createAlert(com.smartcity.emergency_service.grpc.CreateAlertRequest request,
        io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.AlertResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateAlertMethod(), responseObserver);
    }

    /**
     * <pre>
     * Obtenir le statut d'une alerte
     * </pre>
     */
    default void getAlertStatus(com.smartcity.emergency_service.grpc.GetAlertRequest request,
        io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.AlertResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetAlertStatusMethod(), responseObserver);
    }

    /**
     * <pre>
     * Mettre à jour le statut d'une alerte
     * </pre>
     */
    default void updateAlertStatus(com.smartcity.emergency_service.grpc.UpdateAlertRequest request,
        io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.AlertResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUpdateAlertStatusMethod(), responseObserver);
    }

    /**
     * <pre>
     * Stream d'alertes en temps réel
     * </pre>
     */
    default void streamAlerts(com.smartcity.emergency_service.grpc.StreamAlertsRequest request,
        io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.AlertResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getStreamAlertsMethod(), responseObserver);
    }

    /**
     * <pre>
     * Obtenir les ressources disponibles (ambulances, pompiers)
     * </pre>
     */
    default void getAvailableResources(com.smartcity.emergency_service.grpc.ResourceRequest request,
        io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.ResourceResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetAvailableResourcesMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service EmergencyService.
   * <pre>
   * Service principal d'urgence
   * </pre>
   */
  public static abstract class EmergencyServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return EmergencyServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service EmergencyService.
   * <pre>
   * Service principal d'urgence
   * </pre>
   */
  public static final class EmergencyServiceStub
      extends io.grpc.stub.AbstractAsyncStub<EmergencyServiceStub> {
    private EmergencyServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected EmergencyServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new EmergencyServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * Créer une alerte d'urgence
     * </pre>
     */
    public void createAlert(com.smartcity.emergency_service.grpc.CreateAlertRequest request,
        io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.AlertResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateAlertMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Obtenir le statut d'une alerte
     * </pre>
     */
    public void getAlertStatus(com.smartcity.emergency_service.grpc.GetAlertRequest request,
        io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.AlertResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetAlertStatusMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Mettre à jour le statut d'une alerte
     * </pre>
     */
    public void updateAlertStatus(com.smartcity.emergency_service.grpc.UpdateAlertRequest request,
        io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.AlertResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpdateAlertStatusMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Stream d'alertes en temps réel
     * </pre>
     */
    public void streamAlerts(com.smartcity.emergency_service.grpc.StreamAlertsRequest request,
        io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.AlertResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncServerStreamingCall(
          getChannel().newCall(getStreamAlertsMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * Obtenir les ressources disponibles (ambulances, pompiers)
     * </pre>
     */
    public void getAvailableResources(com.smartcity.emergency_service.grpc.ResourceRequest request,
        io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.ResourceResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetAvailableResourcesMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service EmergencyService.
   * <pre>
   * Service principal d'urgence
   * </pre>
   */
  public static final class EmergencyServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<EmergencyServiceBlockingStub> {
    private EmergencyServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected EmergencyServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new EmergencyServiceBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * Créer une alerte d'urgence
     * </pre>
     */
    public com.smartcity.emergency_service.grpc.AlertResponse createAlert(com.smartcity.emergency_service.grpc.CreateAlertRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateAlertMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Obtenir le statut d'une alerte
     * </pre>
     */
    public com.smartcity.emergency_service.grpc.AlertResponse getAlertStatus(com.smartcity.emergency_service.grpc.GetAlertRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetAlertStatusMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Mettre à jour le statut d'une alerte
     * </pre>
     */
    public com.smartcity.emergency_service.grpc.AlertResponse updateAlertStatus(com.smartcity.emergency_service.grpc.UpdateAlertRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpdateAlertStatusMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Stream d'alertes en temps réel
     * </pre>
     */
    public java.util.Iterator<com.smartcity.emergency_service.grpc.AlertResponse> streamAlerts(
        com.smartcity.emergency_service.grpc.StreamAlertsRequest request) {
      return io.grpc.stub.ClientCalls.blockingServerStreamingCall(
          getChannel(), getStreamAlertsMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * Obtenir les ressources disponibles (ambulances, pompiers)
     * </pre>
     */
    public com.smartcity.emergency_service.grpc.ResourceResponse getAvailableResources(com.smartcity.emergency_service.grpc.ResourceRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetAvailableResourcesMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service EmergencyService.
   * <pre>
   * Service principal d'urgence
   * </pre>
   */
  public static final class EmergencyServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<EmergencyServiceFutureStub> {
    private EmergencyServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected EmergencyServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new EmergencyServiceFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * Créer une alerte d'urgence
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.smartcity.emergency_service.grpc.AlertResponse> createAlert(
        com.smartcity.emergency_service.grpc.CreateAlertRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateAlertMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Obtenir le statut d'une alerte
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.smartcity.emergency_service.grpc.AlertResponse> getAlertStatus(
        com.smartcity.emergency_service.grpc.GetAlertRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetAlertStatusMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Mettre à jour le statut d'une alerte
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.smartcity.emergency_service.grpc.AlertResponse> updateAlertStatus(
        com.smartcity.emergency_service.grpc.UpdateAlertRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpdateAlertStatusMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * Obtenir les ressources disponibles (ambulances, pompiers)
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.smartcity.emergency_service.grpc.ResourceResponse> getAvailableResources(
        com.smartcity.emergency_service.grpc.ResourceRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetAvailableResourcesMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_CREATE_ALERT = 0;
  private static final int METHODID_GET_ALERT_STATUS = 1;
  private static final int METHODID_UPDATE_ALERT_STATUS = 2;
  private static final int METHODID_STREAM_ALERTS = 3;
  private static final int METHODID_GET_AVAILABLE_RESOURCES = 4;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final AsyncService serviceImpl;
    private final int methodId;

    MethodHandlers(AsyncService serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_CREATE_ALERT:
          serviceImpl.createAlert((com.smartcity.emergency_service.grpc.CreateAlertRequest) request,
              (io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.AlertResponse>) responseObserver);
          break;
        case METHODID_GET_ALERT_STATUS:
          serviceImpl.getAlertStatus((com.smartcity.emergency_service.grpc.GetAlertRequest) request,
              (io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.AlertResponse>) responseObserver);
          break;
        case METHODID_UPDATE_ALERT_STATUS:
          serviceImpl.updateAlertStatus((com.smartcity.emergency_service.grpc.UpdateAlertRequest) request,
              (io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.AlertResponse>) responseObserver);
          break;
        case METHODID_STREAM_ALERTS:
          serviceImpl.streamAlerts((com.smartcity.emergency_service.grpc.StreamAlertsRequest) request,
              (io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.AlertResponse>) responseObserver);
          break;
        case METHODID_GET_AVAILABLE_RESOURCES:
          serviceImpl.getAvailableResources((com.smartcity.emergency_service.grpc.ResourceRequest) request,
              (io.grpc.stub.StreamObserver<com.smartcity.emergency_service.grpc.ResourceResponse>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  public static final io.grpc.ServerServiceDefinition bindService(AsyncService service) {
    return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
        .addMethod(
          getCreateAlertMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.smartcity.emergency_service.grpc.CreateAlertRequest,
              com.smartcity.emergency_service.grpc.AlertResponse>(
                service, METHODID_CREATE_ALERT)))
        .addMethod(
          getGetAlertStatusMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.smartcity.emergency_service.grpc.GetAlertRequest,
              com.smartcity.emergency_service.grpc.AlertResponse>(
                service, METHODID_GET_ALERT_STATUS)))
        .addMethod(
          getUpdateAlertStatusMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.smartcity.emergency_service.grpc.UpdateAlertRequest,
              com.smartcity.emergency_service.grpc.AlertResponse>(
                service, METHODID_UPDATE_ALERT_STATUS)))
        .addMethod(
          getStreamAlertsMethod(),
          io.grpc.stub.ServerCalls.asyncServerStreamingCall(
            new MethodHandlers<
              com.smartcity.emergency_service.grpc.StreamAlertsRequest,
              com.smartcity.emergency_service.grpc.AlertResponse>(
                service, METHODID_STREAM_ALERTS)))
        .addMethod(
          getGetAvailableResourcesMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.smartcity.emergency_service.grpc.ResourceRequest,
              com.smartcity.emergency_service.grpc.ResourceResponse>(
                service, METHODID_GET_AVAILABLE_RESOURCES)))
        .build();
  }

  private static abstract class EmergencyServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    EmergencyServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.smartcity.emergency_service.grpc.Emergency.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("EmergencyService");
    }
  }

  private static final class EmergencyServiceFileDescriptorSupplier
      extends EmergencyServiceBaseDescriptorSupplier {
    EmergencyServiceFileDescriptorSupplier() {}
  }

  private static final class EmergencyServiceMethodDescriptorSupplier
      extends EmergencyServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    EmergencyServiceMethodDescriptorSupplier(java.lang.String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (EmergencyServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new EmergencyServiceFileDescriptorSupplier())
              .addMethod(getCreateAlertMethod())
              .addMethod(getGetAlertStatusMethod())
              .addMethod(getUpdateAlertStatusMethod())
              .addMethod(getStreamAlertsMethod())
              .addMethod(getGetAvailableResourcesMethod())
              .build();
        }
      }
    }
    return result;
  }
}
