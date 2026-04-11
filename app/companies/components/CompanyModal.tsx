"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, CompanyForm } from "@/app/lib/schema/company.schema";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  data: any;
  onClose: () => void;
  onSubmit: (data: CompanyForm) => Promise<any>;
}

export default function CompanyModal({
  open,
  data,
  onClose,
  onSubmit,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      Name: "",
      Address: "",
      Email: "",
      Mobile: "",
      PlanStart: "",
      PlanEnd: "",
      Active: "1",
    },
  });

  // PREFILL
  useEffect(() => {
    if (data) {
      reset(data);
    } else {
      reset({
        Name: "",
        Address: "",
        Email: "",
        Mobile: "",
        PlanStart: "",
        PlanEnd: "",
        Active: "1",
      });
    }
  }, [data, reset]);

  // CLOSE HANDLER WITH UNSAVED CHECK
  const handleClose = () => {
    if (isDirty) setShowConfirm(true);
    else onClose();
  };

  // SUBMIT
  const submitHandler = async (form: CompanyForm) => {
    try {
      await onSubmit(form);
      toast.success(
        data
          ? "Data updated successfully"
          : "Company created successfully"
      );
      reset();
      onClose();
    } catch {
      toast.error("Something went wrong!");
    }
  };

  if (!open) return null;

  return (
    <>
      {/* MODAL */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-[95%] max-w-3xl max-h-[90vh] rounded-3xl p-8 overflow-y-auto shadow-2xl"
        >
          {/* HEADER */}
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {data ? "Edit Company" : "Add Company"}
            </h2>
            <button onClick={handleClose}>✕</button>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-5"
          >
            {/* NAME */}
            <div>
              <input
                placeholder="Company Name"
                {...register("Name")}
                className="w-full p-3 border rounded-xl"
              />
              {errors.Name && (
                <p className="text-red-500 text-xs">
                  {errors.Name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <input
                placeholder="Email"
                {...register("Email")}
                className="w-full p-3 border rounded-xl"
              />
              {errors.Email && (
                <p className="text-red-500 text-xs">
                  {errors.Email.message}
                </p>
              )}
            </div>

            {/* MOBILE */}
            <div>
              <input
                placeholder="Mobile"
                {...register("Mobile")}
                className="w-full p-3 border rounded-xl"
              />
              {errors.Mobile && (
                <p className="text-red-500 text-xs">
                  {errors.Mobile.message}
                </p>
              )}
            </div>

            {/* ADDRESS */}
            <input
              placeholder="Address"
              {...register("Address")}
              className="w-full p-3 border rounded-xl"
            />

            {/* DATES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="date"
                {...register("PlanStart")}
                className="p-3 border rounded-xl"
              />
              <input
                type="date"
                {...register("PlanEnd")}
                className="p-3 border rounded-xl"
              />
            </div>

            {/* STATUS */}
            <div className="flex justify-between items-center">
              <span>Status</span>
              <select
                {...register("Active")}
                className="border rounded-lg p-2"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-500"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl"
              >
                {isSubmitting ? "Saving..." : "Save Company"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* UNSAVED CONFIRM */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl space-y-4">
            <p>Discard unsaved changes?</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  onClose();
                }}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}