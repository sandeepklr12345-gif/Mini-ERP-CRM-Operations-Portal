import { FormEvent, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiErrorMessage } from "../services/api";
import * as endpoints from "../services/endpoints";
import type { Customer, CreateCustomerInput, UpdateCustomerInput } from "../types";
import { Input, Select, Textarea, Button } from "../components/Form";

export function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const loadCustomer = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const data = await endpoints.getCustomer(id);
        setCustomer(data as Customer);
      } catch (error) {
        toast.error(apiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    loadCustomer();
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const input = {
        name: formData.get("name") as string,
        mobile: formData.get("mobile") as string,
        email: formData.get("email") as string,
        businessName: formData.get("businessName") as string,
        gstNumber: formData.get("gstNumber") as string,
        customerType: formData.get("customerType") as string,
        address: formData.get("address") as string,
        status: formData.get("status") as string,
        followUpDate: formData.get("followUpDate") as string,
        notes: formData.get("notes") as string,
      };

      if (id) {
        await endpoints.updateCustomer(id, input as UpdateCustomerInput);
        toast.success("Customer updated successfully");
      } else {
        await endpoints.createCustomer(input as CreateCustomerInput);
        toast.success("Customer created successfully");
      }

      navigate("/customers");
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="section-card p-6 text-muted">Loading customer details…</div>;

  return (
    <div className="max-w-2xl">
      <div className="page-heading"><div><h1>{id ? "Edit" : "Add"} customer</h1><p>Keep contact information and follow-up details complete.</p></div></div>

      <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-lg shadow p-6 flex flex-col gap-4">
        <Input
          label="Name *"
          name="name"
          defaultValue={customer?.name}
          required
        />

        <Input
          label="Mobile *"
          name="mobile"
          defaultValue={customer?.mobile}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          defaultValue={customer?.email}
        />

        <Input
          label="Business Name"
          name="businessName"
          defaultValue={customer?.businessName}
        />

        <Input
          label="GST Number"
          name="gstNumber"
          defaultValue={customer?.gstNumber}
        />

        <Select
          label="Customer Type *"
          name="customerType"
          defaultValue={customer?.customerType}
          required
        >
          <option value="">Select Type</option>
          <option value="RETAIL">Retail</option>
          <option value="DISTRIBUTOR">Distributor</option>
          <option value="WHOLESALE">Wholesale</option>
        </Select>

        <Textarea
          label="Address"
          name="address"
          defaultValue={customer?.address}
        />

        <Select
          label="Status *"
          name="status"
          defaultValue={customer?.status}
          required
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </Select>

        <Input
          label="Follow-up Date"
          name="followUpDate"
          type="date"
          defaultValue={customer?.followUpDate?.split("T")[0]}
        />

        <Textarea
          label="Notes"
          name="notes"
          defaultValue={customer?.notes}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/customers")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
