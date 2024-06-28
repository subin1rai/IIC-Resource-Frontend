import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CustomerService } from "./service/CustomerService";

export default function ItemTable() {
  const [customers, setCustomers] = useState([]);

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  useEffect(() => {
    CustomerService.getCustomersMedium().then((data) => setCustomers(data));
  }, []);

  return (
    <div className="card">
      <DataTable
        value={customers}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
      >
        <Column field="name" header="Name" style={{ width: "25%" }}></Column>
        <Column
          field="country.name"
          header="Country"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="company"
          header="Company"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="representative.name"
          header="Representative"
          style={{ width: "25%" }}
        ></Column>
      </DataTable>
    </div>
  );
}
