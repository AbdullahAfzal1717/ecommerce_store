import React from "react";

const Page = ({ Component, hoc , props }) => {
  if (hoc) {
    const WrappedComponent = hoc(Component);
    return <WrappedComponent />;
  }
  return <Component />;
};

export { Page };
