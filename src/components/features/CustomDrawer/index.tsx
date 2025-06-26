const CustomDrawer = ({
  isOpen,
  onClose,
  title,
  children,
  width = "w-64",
}: any) => {
  return (
    <div
      className={`fixed top-0 z-50 opacity-100 right-0 h-screen ${width} backdrop-blur-sm bg-white/40 shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-red-700">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-600 font-bold focus:outline-none"
        >
          X
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default CustomDrawer;
