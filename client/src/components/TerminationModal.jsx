import React, { useState } from "react";
import { FaTimes, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import api from "../utils/api";
import toast from "react-hot-toast";

const TerminationModal = ({ student, isOpen, onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [canReapply, setCanReapply] = useState(false);
  const [reapplyDate, setReapplyDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error("Please provide a termination reason");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(
        `/admin/students/${student.id}/terminate`,
        {
          reason: reason.trim(),
          canReapply,
          reapplyDate: canReapply && reapplyDate ? reapplyDate : null,
        }
      );

      if (response.data.success) {
        toast.success("Student terminated successfully");
        onSuccess?.();
        handleClose();
      } else {
        toast.error(response.data.message || "Failed to terminate student");
      }
    } catch (error) {
      console.error("Error terminating student:", error);
      toast.error(
        error.response?.data?.message || "Failed to terminate student"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setCanReapply(false);
    setReapplyDate("");
    onClose();
  };

  if (!isOpen || !student) return null;

  // Get minimum date for reapply (30 days from now)
  const minReapplyDate = new Date();
  minReapplyDate.setDate(minReapplyDate.getDate() + 30);
  const minDateString = minReapplyDate.toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-md border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white flex items-center">
            <FaExclamationTriangle className="w-5 h-5 mr-2 text-red-400" />
            Terminate Student
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded transition-colors duration-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Warning */}
          <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-red-300 font-medium mb-1">Warning</h4>
                <p className="text-red-200 text-sm">
                  You are about to terminate <strong>{student.name}</strong>{" "}
                  from the program. This action will revoke their student status
                  and access to student resources.
                </p>
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              {student.profilePicture ? (
                <img
                  src={student.profilePicture}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {student.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h4 className="text-white font-medium">{student.name}</h4>
                <p className="text-gray-400 text-sm">{student.email}</p>
                <p className="text-gray-400 text-sm">{student.college}</p>
              </div>
            </div>
          </div>

          {/* Termination Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Termination Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a detailed reason for termination..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
            <p className="text-gray-400 text-xs mt-1">
              This reason will be recorded and may be visible to the student.
            </p>
          </div>

          {/* Reapply Options */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="canReapply"
                checked={canReapply}
                onChange={(e) => setCanReapply(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="canReapply"
                className="ml-2 text-sm text-gray-300"
              >
                Allow student to reapply in the future
              </label>
            </div>

            {canReapply && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Earliest Reapply Date
                </label>
                <input
                  type="date"
                  value={reapplyDate}
                  onChange={(e) => setReapplyDate(e.target.value)}
                  min={minDateString}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-gray-400 text-xs mt-1">
                  Minimum 30 days from today. Leave empty for no restriction.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                  Terminating...
                </>
              ) : (
                "Terminate Student"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TerminationModal;
