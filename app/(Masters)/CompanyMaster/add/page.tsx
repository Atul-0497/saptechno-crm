import AddCompanyClient from "./AddCompanyClient";
import { createMaster } from "@/app/actions/masters";

export default function AddCompanyPage() {
  return <AddCompanyClient createAction={createMaster} />;
}
