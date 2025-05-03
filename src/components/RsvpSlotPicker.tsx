import React, { useState } from 'react';
import { format, addHours, parse, isValid } from 'date-fns';
import styled from '@emotion/styled';

interface DateTimePickerProps {
  startDate?: Date;
  endDate?: Date;
  onChange?: (selectedTimes: { start: Date; end: Date }[]) => void;
  minTime?: string; // Format: "HH:mm"
  maxTime?: string; // Format: "HH:mm"
  disabled?: boolean;
  className?: string;
}

const RsvpSlotPicker: React.FC<DateTimePickerProps> = ({
  startDate = new Date(),
  endDate = new Date(new Date().setHours(23, 59, 59, 999)),
  onChange,
  minTime = "00:00",
  maxTime = "23:59",
  disabled = false,
  className = "",
}) => {
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{ start: Date; end: Date }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate time slots in 2-hour increments
  const generateTimeSlots = () => {
    const slots = [];
    const parseTimeString = (timeStr: string): Date | null => {
      const parsedTime = parse(timeStr, "HH:mm", new Date());
      return isValid(parsedTime) ? parsedTime : null;
    };

    const minDateTime = parseTimeString(minTime) || new Date(startDate).setHours(0, 0, 0, 0);
    const maxDateTime = parseTimeString(maxTime) || new Date(startDate).setHours(23, 59, 59, 999);

    let currentTime = new Date(minDateTime);
    
    while (currentTime < new Date(maxDateTime)) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(addHours(currentTime, 2));
      
      // Don't add slots that go beyond the max time
      if (slotEnd <= new Date(maxDateTime)) {
        slots.push({
          start: slotStart,
          end: slotEnd,
          label: `${format(slotStart, 'MMM do')}  ${format(slotStart, 'h')} - ${format(slotEnd, 'h a')}`,
        });
      }
      
      currentTime = addHours(currentTime, 2);
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeSlotClick = (slot: { start: Date; end: Date }) => {
    if (disabled) return;

    setSelectedTimeSlots((prevSelected) => {
      // Check if this slot is already selected
      const isSelected = prevSelected.some(
        (selected) => 
          selected.start.getTime() === slot.start.getTime() && 
          selected.end.getTime() === slot.end.getTime()
      );

      let newSelected;
      if (isSelected) {
        // Remove the slot if already selected
        newSelected = prevSelected.filter(
          (selected) => 
            !(selected.start.getTime() === slot.start.getTime() && 
              selected.end.getTime() === slot.end.getTime())
        );
      } else {
        // Add the slot if not selected
        newSelected = [...prevSelected, slot];
      }

      // Sort the slots by start time
      newSelected.sort((a, b) => a.start.getTime() - b.start.getTime());
      
      // Call onChange callback if provided
      if (onChange) {
        onChange(newSelected);
      }
      
      return newSelected;
    });
  };

  const isTimeSlotSelected = (slot: { start: Date; end: Date }) => {
    return selectedTimeSlots.some(
      (selected) => 
        selected.start.getTime() === slot.start.getTime() && 
        selected.end.getTime() === slot.end.getTime()
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getSelectedSlotsText = () => {
    if (selectedTimeSlots.length === 0) {
      return "Select a time slot";
    }
    
    if (selectedTimeSlots.length === 1) {
      const slot = selectedTimeSlots[0];
      return `${format(slot.start, 'MMM do')}  ${format(slot.start, 'h')} - ${format(slot.end, 'h a')}`;
    }
    
    return `${selectedTimeSlots.length} time slots selected`;
  };

  return (
    <DateTimePickerContainer className={`date-time-picker ${className}`}>
      <FormGroup>
        <FormLabel>
          <FormIcon>
            <CalendarIcon />
          </FormIcon>
          Select Time Slot
        </FormLabel>
        <SlotSelector onClick={openModal} disabled={disabled}>
          {getSelectedSlotsText()}
        </SlotSelector>
      </FormGroup>

      {isModalOpen && (
        <Modal>
          <ModalOverlay onClick={closeModal} />
          <ModalContent>
            <ModalHeader>
              <h3>Select Time Slots</h3>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
              <div className="time-slots-container">
                {timeSlots.map((slot, index) => (
                  <TimeSlotButton
                    key={index}
                    className={`time-slot ${isTimeSlotSelected(slot) ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                    onClick={() => handleTimeSlotClick(slot)}
                    disabled={disabled}
                    isSelected={isTimeSlotSelected(slot)}
                  >
                    {slot.label}
                  </TimeSlotButton>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <ConfirmButton onClick={closeModal}>Confirm Selection</ConfirmButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </DateTimePickerContainer>
  );
};

// Styled components
const DateTimePickerContainer = styled.div`
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormIcon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

const CalendarIcon = styled.div`
  &:before {
    content: "📅";
  }
`;

const SlotSelector = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
  
  &:hover {
    border-color: #888;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: relative;
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  h3 {
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
  
  .time-slots-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.75rem;
  }
`;

const TimeSlotButton = styled.button<{ isSelected: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${props => props.isSelected ? '#4a90e2' : '#ddd'};
  border-radius: 4px;
  background-color: ${props => props.isSelected ? '#e6f0ff' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  color: #000;
  
  &:hover {
    border-color: #4a90e2;
    background-color: ${props => props.isSelected ? '#d6e6ff' : '#f5f9ff'};
  }
  
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ModalFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
`;

const ConfirmButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

export default RsvpSlotPicker;
