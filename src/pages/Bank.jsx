import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BankDetailsModal from '../components/bank/BankDetailsModal';

import { bankLogoMap } from '../utils/bankLogoMap'; 

function Bank() {
  const title = "Bank Details";
  const description = "Update and manage your company bank details here.";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);
  const [editingBank, setEditingBank] = useState(null);

  // Load bank details from local storage on component mount
  useEffect(() => {
    const storedBankDetails = localStorage.getItem('bankDetails');
    if (storedBankDetails) {
      setBankDetails(JSON.parse(storedBankDetails));
    }
  }, []);

  // Save bank details to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('bankDetails', JSON.stringify(bankDetails));
  }, [bankDetails]);

  const handleSave = (formData) => {
    if (editingBank !== null) {
      // Update existing bank details
      const updatedBankDetails = [...bankDetails];
      updatedBankDetails[editingBank] = formData;
      setBankDetails(updatedBankDetails);
    } else {
      // Add new bank details
      setBankDetails([...bankDetails, formData]);
    }

    // Close modal and reset editing state
    setIsModalOpen(false);
    setEditingBank(null);
  };

  const handleEdit = (index) => {
    setEditingBank(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const updatedBankDetails = [...bankDetails];
    updatedBankDetails.splice(index, 1);
    setBankDetails(updatedBankDetails);
  };

  const handleAddNew = () => {
    setEditingBank(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBank(null);
  };

  return (
    <div className='bg-gradient-to-r from-[#E9FAFF] to-[#EEF3F9] h-full min-h-screen'>
      <Header title={title} description={description} />
      <div className='mx-16 my-10'>
        <div className='flex justify-end'>
          <button
            onClick={handleAddNew}
            className='bg-gradient-to-r from-[#32B4DB] to-[#156AEF] px-4 py-2 rounded-md text-white text-md font-semibold cursor-pointer'
          >
            Add
          </button>
        </div>

        {bankDetails.length === 0 ? (
          <div className='bg-white p-10 rounded-xl mt-5 text-center'>
            <p className='text-[#737272] text-lg'>No bank details added yet. Click the "Add" button to add your first bank details.</p>
          </div>
        ) : (
          bankDetails.map((bank, index) => (
            <div key={index} className='bg-white grid grid-cols-6 gap-x-6 gap-y-16 p-10 rounded-xl mt-5'>
              <div className='flex flex-col'>
                <label className='text-[#737272] text-[16px] font-semibold'>Holder Name</label>
                <span className='text-[18px] font-semibold'>{bank.holderName}</span>
              </div>
              <div className='flex flex-col'>
                <label className='text-[#737272] text-[16px] font-semibold'>Bank Name</label>
                <span className='text-[18px] font-semibold'>{bank.bankName}</span>
              </div>
              <div className='flex flex-col'>
                <label className='text-[#737272] text-[16px] font-semibold'>Account Number</label>
                <span className='text-[18px] font-semibold'>{bank.accountNumber}</span>
              </div>
              <div className='flex flex-col'>
                <label className='text-[#737272] text-[16px] font-semibold'>IBAN</label>
                <span className='text-[18px] font-semibold'>{bank.iban}</span>
              </div>
              <div className='flex flex-col'>
                <label className='text-[#737272] text-[16px] font-semibold'>IFSC</label>
                <span className='text-[18px] font-semibold'>{bank.ifsc}</span>
              </div>
              <div className='flex flex-col'>
                <label className='text-[#737272] text-[16px] font-semibold'>SWIFT</label>
                <span className='text-[18px] font-semibold'>{bank.swift}</span>
              </div>
              <div className='flex flex-col'>
                <label className='text-[#737272] text-[16px] font-semibold'>Branch</label>
                <span className='text-[18px] font-semibold'>{bank.branch}</span>
              </div>
              <div className='flex flex-col'>
                <label className='text-[#737272] text-[16px] font-semibold'>City</label>
                <span className='text-[18px] font-semibold'>{bank.city}</span>
              </div>
              <div className='flex flex-col'>
                <label className='text-[#737272] text-[16px] font-semibold'>Country</label>
                <span className='text-[18px] font-semibold'>{bank.country}</span>
              </div>
              <div className='flex flex-col'>
                <label className='text-[#737272] text-[16px] font-semibold'>Logo</label>
                {bank.bankName && bankLogoMap[bank.bankName] ? (
                  <img
                    src={bankLogoMap[bank.bankName]} // Use the logo from the map
                    alt="Bank Logo"
                    className="w-56 h-24"
                  />
                ) : (
                  <span className='text-[16px] text-gray-400'>No logo</span>
                )}
              </div>
              <div className='flex flex-col'>
                <label className='text-[#737272] text-[16px] font-semibold'>Action</label>
                <div className='flex flex-row gap-3'>
                  <button
                    onClick={() => handleEdit(index)}
                    className='bg-gradient-to-r from-[#32B4DB] to-[#156AEF] px-4 py-2 rounded-md text-white text-md font-semibold cursor-pointer'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className='bg-gradient-to-r from-[#F44336] to-[#D32F2F] px-4 py-2 rounded-md text-white text-md font-semibold cursor-pointer'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Use the new modal component */}
      <BankDetailsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editData={editingBank !== null ? bankDetails[editingBank] : null}
      />
    </div>
  );
}

export default Bank;
