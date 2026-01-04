import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../../services/addressService";
import type { Address } from "../../../types/types";

interface AddressFormData {
  title: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  recipientName: string;
}

interface AddressManagerProps {
  userId: string;
  onSelectAddress?: (address: Address) => void;
  selectionMode?: boolean;
}

export default function AddressManager({
  userId,
  onSelectAddress,
  selectionMode = false,
}: AddressManagerProps) {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    title: "",
    fullAddress: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    recipientName: "",
  });

  const loadAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserAddresses(userId);
      setAddresses(data);
    } catch (error) {
      console.error("Error loading addresses:", error);
      toast.error(t("address.loadError"));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const addressData = {
        ...formData,
        userId,
        isDefault: addresses.length === 0,
      };

      if (editingId) {
        await updateAddress(editingId, formData);
        toast.success(t("address.updated"));
      } else {
        await createAddress(addressData);
        toast.success(t("address.saved"));
      }

      await loadAddresses();
      resetForm();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(t("address.saveError"));
    }
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      title: address.title,
      fullAddress: address.fullAddress,
      city: address.city,
      postalCode: address.postalCode || "",
      phoneNumber: address.phoneNumber,
      recipientName: address.recipientName,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("address.deleteConfirm"))) {
      try {
        await deleteAddress(id);
        toast.success(t("address.deleted"));
        await loadAddresses();
      } catch (error) {
        console.error("Error deleting address:", error);
        toast.error(t("address.deleteError"));
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(userId, id);
      toast.success(t("address.defaultSet"));
      await loadAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error(t("address.defaultError"));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      fullAddress: "",
      city: "",
      postalCode: "",
      phoneNumber: "",
      recipientName: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">
          {t("address.title")}
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t("address.addNew")}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("address.addressTitle")}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder={t("address.addressTitlePlaceholder")}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("address.recipientName")}
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) =>
                  setFormData({ ...formData, recipientName: e.target.value })
                }
                placeholder={t("address.recipientNamePlaceholder")}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("address.fullAddress")}
            </label>
            <textarea
              value={formData.fullAddress}
              onChange={(e) =>
                setFormData({ ...formData, fullAddress: e.target.value })
              }
              placeholder={t("address.fullAddressPlaceholder")}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("address.city")}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder={t("address.cityPlaceholder")}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("address.postalCode")}
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
                placeholder={t("address.postalCodePlaceholder")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("address.phoneNumber")}
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder={t("address.phoneNumberPlaceholder")}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t("address.save")}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              {t("address.cancel")}
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {t("address.noAddresses")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-2 ${
                address.isDefault ? "border-blue-500" : "border-transparent"
              } ${
                selectionMode
                  ? "cursor-pointer hover:border-blue-400 transition-colors"
                  : ""
              }`}
              onClick={() =>
                selectionMode && onSelectAddress && onSelectAddress(address)
              }
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg dark:text-white">
                    {address.title}
                  </h3>
                  {address.isDefault && (
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded mt-1">
                      {t("address.default")}
                    </span>
                  )}
                </div>
                {!selectionMode && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      {t("address.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      {t("address.delete")}
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {address.recipientName}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {address.fullAddress}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {address.city}
                {address.postalCode && ` - ${address.postalCode}`}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {address.phoneNumber}
              </p>

              {!address.isDefault && !selectionMode && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="mt-4 text-sm text-blue-500 hover:text-blue-600"
                >
                  {t("address.setDefault")}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
