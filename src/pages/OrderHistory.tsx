import React from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Order } from "../types";

interface OrderHistoryProps {
  orders: Order[];
}

const getStatusIcon = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    case "confirmed":
    case "preparing":
      return <Package className="w-5 h-5 text-blue-500" />;
    case "ready":
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    case "delivered":
      return <TruckIcon className="w-5 h-5 text-green-600" />;
    case "cancelled":
      return <XCircleIcon className="w-5 h-5 text-red-500" />;
    default:
      return <ClockIcon className="w-5 h-5 text-gray-500" />;
  }
};

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-vazir">{t("nav.back")}</span>
          </button>
          <h1 className="text-3xl font-bold font-vazir">{t("orders.title")}</h1>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2 font-vazir">
                {t("orders.noOrders")}
              </h2>
              <p className="text-gray-500 dark:text-gray-500 font-vazir">
                {t("orders.noOrdersDescription")}
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <span className="text-lg font-bold text-gray-800 dark:text-white font-vazir">
                      {t("orders.orderNumber")} {order.id.slice(-6)}
                    </span>
                    {getStatusIcon(order.status)}
                    <span className="font-medium font-vazir">
                      {t(`orders.status.${order.status}`)}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-bold text-primary font-vazir">
                      {i18n.language === "fa"
                        ? order.total.toLocaleString("fa-IR")
                        : order.total.toLocaleString("en-US")}{" "}
                      {t("menu.toman")}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-vazir">
                      {new Date(order.createdAt).toLocaleDateString(
                        i18n.language === "fa" ? "fa-IR" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 font-vazir">
                    {t("orders.items")} ({order.items.length})
                  </h3>
                  <div className="grid gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-3"
                      >
                        <img
                          src={item.image}
                          alt={
                            i18n.language === "fa" ? item.name.fa : item.name.en
                          }
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://via.placeholder.com/300x200?text=No+Image";
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium font-vazir">
                            {i18n.language === "fa"
                              ? item.name.fa
                              : item.name.en}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-vazir">
                            {item.quantity} ×{" "}
                            {i18n.language === "fa"
                              ? item.price.toLocaleString("fa-IR")
                              : item.price.toLocaleString("en-US")}{" "}
                            {t("menu.toman")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary font-vazir">
                            {i18n.language === "fa"
                              ? (item.price * item.quantity).toLocaleString(
                                  "fa-IR"
                                )
                              : (item.price * item.quantity).toLocaleString(
                                  "en-US"
                                )}{" "}
                            {t("menu.toman")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 font-vazir">
                      {t("orders.deliveryAddress")}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 font-vazir">
                      {order.deliveryAddress}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
