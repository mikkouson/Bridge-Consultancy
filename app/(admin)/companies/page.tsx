"use client";
import React from "react";
import useSWR from "swr";
const Companies = () => {
  const { data } = useSWR("/api/companies", (url) =>
    fetch(url).then((res) => res.json())
  );
  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export default Companies;
