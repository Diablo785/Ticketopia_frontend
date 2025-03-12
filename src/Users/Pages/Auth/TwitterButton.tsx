import React from "react";
import { Button, ButtonProps } from "@mantine/core";

function TwitterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#00ACEE"
      viewBox="0 0 24 24"
    >
      <path d="M23.643 4.937c-.835.37-1.73.62-2.675.733a4.695 4.695 0 0 0 2.048-2.588 9.308 9.308 0 0 1-2.966 1.133 4.676 4.676 0 0 0-7.965 4.265A13.276 13.276 0 0 1 1.64 3.162a4.674 4.674 0 0 0 1.447 6.25 4.647 4.647 0 0 1-2.121-.585v.06a4.675 4.675 0 0 0 3.75 4.578 4.67 4.67 0 0 1-2.114.08 4.676 4.676 0 0 0 4.36 3.236 9.384 9.384 0 0 1-6.92 1.936 13.195 13.195 0 0 0 7.161 2.099c8.586 0 13.28-7.118 13.28-13.28 0-.203-.004-.407-.013-.61a9.54 9.54 0 0 0 2.34-2.435z" />
    </svg>
  );
}

export function TwitterButton(props: ButtonProps & React.ComponentPropsWithoutRef<"button">) {
  return <Button leftSection={<TwitterIcon />} variant="default" {...props} />;
}
