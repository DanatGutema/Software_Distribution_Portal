import React, { useState, useRef, useEffect } from "react";

interface DialogProps {
  children: React.ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === DialogTrigger) {
        return React.cloneElement(child, { isOpen, setIsOpen } as any);
      }
      if (child.type === DialogContent) {
        return React.cloneElement(child, { isOpen, setIsOpen } as any);
      }
    }
    return child;
  });

  return <div ref={dialogRef}>{childrenWithProps}</div>;
};

export const DialogTrigger: React.FC<DialogTriggerProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }> = ({
  children,
  asChild,
  isOpen,
  setIsOpen,
}) => {
  const handleClick = () => {
    setIsOpen?.(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    } as any);
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  );
};

// export const DialogContent: React.FC<DialogContentProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }> = ({
//   children,
//   className = "",
//   isOpen,
//   setIsOpen,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 z-50"
//         onClick={() => setIsOpen?.(false)}
//       />
//       {/* Modal */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
//         <div
//            className={`relative bg-white rounded-lg shadow-xl max-h-[80vh] overflow-auto w-full sm:w-[500px] p-6 ${className}`}
//            //onClick={(e) => e.stopPropagation()}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {children}
//         </div>
//       </div>
//     </>
//   );
// };


export const DialogContent: React.FC<
  DialogContentProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }
> = ({ children, className = "", isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
      style={{ backgroundColor: "#e6e1e1"}}
        className="absolute inset-0 bg-opacity-30"
        onClick={() => setIsOpen?.(false)}
      />

      {/* Modal */}
      <div
      style={{ backgroundColor: "#242481" }}

        className={`relative rounded-lg shadow-xl max-h-[80vh] overflow-auto w-full sm:w-[500px] p-6 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};



export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return (
    <div className="border-b border-gray-200 p-6">
      {children}
    </div>
  );
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
  return (
    <h2 className="text-xl font-semibold text-white">
      {children}
    </h2>
  );
};





