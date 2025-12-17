import grpc
import os
import sys
sys.path.insert(0, '/app/protos')
import emergency_pb2
import emergency_pb2_grpc

class EmergencyConnector:
    def __init__(self):
        self.host = os.getenv("EMERGENCY_SERVICE_HOST", "emergency-service")
        self.port = os.getenv("GRPC_SERVER_PORT", "9093")
        self.channel = None
        self.stub = None

    def connect(self):
        if not self.channel:
            target = f"{self.host}:{self.port}"
            print(f"Connecting to Emergency Service gRPC at {target}")
            self.channel = grpc.insecure_channel(target)
            self.stub = emergency_pb2_grpc.EmergencyServiceStub(self.channel)

    def create_alert(self, type_str, location, severity_str, description, reported_by, lat=None, lon=None):
        self.connect()
        
        # Map strings to enums
        # Note: This mapping needs to match the proto enum names exactly or be handled carefully
        alert_type = getattr(emergency_pb2, type_str, emergency_pb2.MEDICAL_EMERGENCY)
        severity = getattr(emergency_pb2, severity_str, emergency_pb2.MEDIUM)

        request = emergency_pb2.CreateAlertRequest(
            type=alert_type,
            location=location,
            severity=severity,
            description=description,
            reportedBy=reported_by
        )

        if lat is not None and lon is not None:
            request.coordinates.latitude = lat
            request.coordinates.longitude = lon

        try:
            response = self.stub.CreateAlert(request)
            return {
                "alertId": response.alertId,
                "status": "CREATED",
                "assignedUnit": response.assignedUnit
            }
        except grpc.RpcError as e:
            print(f"gRPC Error: {e}")
            return {"error": str(e)}

    def get_alert_status(self, alert_id):
        self.connect()
        request = emergency_pb2.GetAlertRequest(alertId=alert_id)
        try:
            response = self.stub.GetAlertStatus(request)
            return {
                "alertId": response.alertId,
                "status": emergency_pb2.AlertStatus.Name(response.status),
                "assignedUnit": response.assignedUnit
            }
        except grpc.RpcError as e:
            return {"error": str(e)}

    def get_all_alerts(self):
        self.connect()
        request = emergency_pb2.Empty()
        try:
            response = self.stub.GetAllAlerts(request)
            alerts = []
            for alert in response.alerts:
                alerts.append({
                    "alertId": alert.alertId,
                    "type": emergency_pb2.AlertType.Name(alert.type),
                    "location": alert.location,
                    "severity": emergency_pb2.Severity.Name(alert.severity),
                    "description": alert.description,
                    "status": emergency_pb2.AlertStatus.Name(alert.status),
                    "timestamp": alert.timestamp,
                    "assignedUnit": alert.assignedUnit
                })
            return alerts
        except grpc.RpcError as e:
            print(f"gRPC Error in get_all_alerts: {e}")
            return []
