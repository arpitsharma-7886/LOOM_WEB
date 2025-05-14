import React from 'react';

const SizeChartModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-5xl max-h-[90vh] overflow-hidden relative flex flex-col md:flex-row">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl cursor-pointer"
                >
                    ✕
                </button>

                {/* Left - Table */}
                <div className="w-full md:w-1/2 overflow-auto p-6">
                    <h2 className="text-2xl font-semibold mb-4">Size Chart</h2>
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2">Size</th>
                                <th className="p-2">Chest</th>
                                <th className="p-2">Brand Size</th>
                                <th className="p-2">Length</th>
                                <th className="p-2">Sleeve Length</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ['S', 38, 36, 27, 10],
                                ['M', 40, 38, 27, 10.5],
                                ['L', 42, 40, 27, 10.5],
                                ['XL', 44, 42, 28, 11.5],
                                ['XXL', 46, 44, 28, 11.5],
                            ].map(([size, chest, brand, length, sleeve], idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="p-2">{size}</td>
                                    <td className="p-2">{chest}</td>
                                    <td className="p-2">{brand}</td>
                                    <td className="p-2">{length}</td>
                                    <td className="p-2">{sleeve}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Right - Info */}
                <div className="w-full md:w-1/2 overflow-auto border-l p-6 text-sm text-gray-700">
                    <h3 className="text-lg font-semibold mb-2">Full Sleeve Shirts</h3>
                    <p className="mb-2">
                        Not sure about your shirt size? Follow these simple steps to figure it out:
                        <strong> Shoulder</strong> – Measure the shoulder at the back, from edge to edge with arms relaxed on both sides.
                        <strong> Chest</strong> – Measure around the body under the arms at the fullest part of the chest with your arms relaxed at both sides.
                        <strong> Sleeve</strong> – Measure from the shoulder seam through the outer arm to the cuff/hem.
                        <strong> Neck</strong> – Measured horizontally across the neck.
                        <strong> Length</strong> – Measure from the highest point of the shoulder seam to the bottom hem of the garment.
                    </p>
                    <img
                        src="/path-to-your-uploaded-image.png" // Replace this path with your image URL
                        alt="Measurement Guide"
                        className="mt-4 max-w-full h-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default SizeChartModal;
