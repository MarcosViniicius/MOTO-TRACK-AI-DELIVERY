
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

export const NotificationDropdown = ({ notifications, onClose }: NotificationDropdownProps) => {
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute top-16 right-4">
        <Card className="w-80 max-h-96 overflow-y-auto shadow-lg" onClick={(e) => e.stopPropagation()}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Notificações</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      {!notification.read && (
                        <Badge className="w-2 h-2 p-0 bg-blue-500 rounded-full mt-2" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p className="text-sm">Nenhuma notificação</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
