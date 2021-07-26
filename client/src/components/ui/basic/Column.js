import React from "react";

// export interface ColumnProps {
//   className?: String;
//   children: any;
// }

// export const Column: React.FC<ColumnProps> = ({
//   className: customClassName,
//   children
// }) => {
//   let className = customClassName ? customClassName : "";
//   return <div className={"column flex flex-col " + className}>{children}</div>;
// };

export const Column = ({
  name,
  kind,
  className: customClassName,
  children,
  ...rest
}) => {
  let className = ["flex flex-col", customClassName].join(" ");
  return (
    <div
      name={name ? name : null}
      kind="Column"
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
};
