import React, { useState, useRef, useEffect } from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === DropdownMenuTrigger) {
        return React.cloneElement(child, { isOpen, setIsOpen } as any);
      }
      if (child.type === DropdownMenuContent) {
        return React.cloneElement(child, { isOpen, setIsOpen } as any);
      }
    }
    return child;
  });

  return <div ref={dropdownRef} className="relative">{childrenWithProps}</div>;
};

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }> = ({
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

export const DropdownMenuContent: React.FC<DropdownMenuContentProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }> = ({
  children,
  className = "",
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${className}`}
    >
      <div className="py-1" role="menu">
        {children}
      </div>
    </div>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps & { setIsOpen?: (open: boolean) => void }> = ({
  children,
  onClick,
  className = "",
  setIsOpen,
}) => {
  const handleClick = () => {
    onClick?.();
    setIsOpen?.(false);
  };

  return (
    <div
      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center ${className}`}
      role="menuitem"
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

