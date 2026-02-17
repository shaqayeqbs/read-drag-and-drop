import React from "react";
import { useTranslation } from "react-i18next";
import { X, Clock, CheckCircle, Package, Truck } from "lucide-react";
import type { Order } from "../../types/types";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const getStatusIcon = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "confirmed":
    case "preparing":
      return <Package className="w-4 h-4 text-blue-500" />;
    case "ready":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "delivered":
      return <Truck className="w-4 h-4 text-green-600" />;
    case "cancelled":
      return <X className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const { t, i18n } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      style={{ isolation: "isolate" }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden m-4 relative z-[51]"
        style={{ isolation: "isolate", WebkitTransform: "translate3d(0,0,0)" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white font-vazir">
            {t("orders.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-vazir">{t("orders.noOrders")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 font-vazir">
                          {t("orders.orderNumber")}
                          {order.id.slice(-6)}
                        </span>
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium font-vazir">
                          {t(`orders.status.${order.status}`)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-vazir">
                        {t("orders.orderDate")}:{" "}
                        {new Date(order.createdAt).toLocaleDateString(
                          i18n.language === "fa" ? "fa-IR" : "en-US",
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary font-vazir">
                        {i18n.language === "fa"
                          ? order.total.toLocaleString("fa-IR")
                          : order.total.toLocaleString("en-US")}{" "}
                        {t("menu.toman")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 text-sm"
                      >
                        <img
                          src={item.image}
                          alt={
                            i18n.language === "fa" ? item.name.fa : item.name.en
                          }
                          className="w-8 h-8 rounded object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://via.placeholder.com/300x200?text=No+Image";
                          }}
                        />
                        <span className="flex-1 font-vazir">
                          {i18n.language === "fa" ? item.name.fa : item.name.en}{" "}
                          x{item.quantity}
                        </span>
                        <span className="font-vazir">
                          {i18n.language === "fa"
                            ? (item.price * item.quantity).toLocaleString(
                                "fa-IR",
                              )
                            : (item.price * item.quantity).toLocaleString(
                                "en-US",
                              )}{" "}
                          {t("menu.toman")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
