import React from "react";
import { 
  render, 
  cleanup, 
  fireEvent, 
  findByText, 
  getAllByTestId, 
  getByAltText, 
  getByPlaceholderText, 
  getByText,
  queryByText,
  waitForElementToBeRemoved,
  queryByAltText
} from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import Application from "../Application";
import axios from "../../__mocks__/axios";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { container } = render(<Application />);
    
    await findByText(container, "Monday");
    
    fireEvent.click(getByText(container, "Tuesday"));
    
    expect(await findByText(container, "Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    
    await findByText(container, "Archie Cohen");

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(
      getByPlaceholderText(appointment, /enter student name/i), 
      { target: { value: "Lydia Miller-Jones" } }
    );
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => queryByText(appointment, /saving/i));

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const days = getAllByTestId(container, "day");
    const mondayDayItem = days.find(day => 
      queryByText(day, "Monday")
    );
    expect(getByText(mondayDayItem, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
  const { container } = render(<Application />);

  // 2. Wait until the text "Archie Cohen" is displayed.
  await findByText(container, "Archie Cohen");

  // 3. Click the "Delete" button on the booked appointment.
  const appointment = getAllByTestId(container, "appointment").find((appointment) =>
    queryByText(appointment, "Archie Cohen")
  );

  fireEvent.click(queryByAltText(appointment, "Delete"));
  // 4. Check that the confirmation message is shown.
  expect(getByText(appointment, "Are you sure you want to delete?")).toBeInTheDocument();
  // 5. Click the "Confirm" button.
  fireEvent.click(getByText(appointment, "Confirm"));
  // 6. Check that the element with the text "Deleting" is displayed.
  expect(getByText(appointment, /deleting/i)).toBeInTheDocument();
  // 7. Wait until the appointment slot is empty again.
  await waitForElementToBeRemoved(() => queryByText(appointment, /deleting/i));
  // 8. Check that the DayListItem with the text "Monday" has increased its spots remaining by 1.
  const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
   
  expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    
    // Wait for the existing interview ("Lydia Miller-Jones") to load
    await findByText(container, "Lydia Miller-Jones");
  
    // Find the appointment and click Edit
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Lydia Miller-Jones")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));
  
    // Change the name
    fireEvent.change(
      getByPlaceholderText(appointment, /enter student name/i),
      { target: { value: "New Student Name" } }
    );
  
    // Select interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  
    // Save
    fireEvent.click(getByText(appointment, "Save"));
  
    // Verify saving indicator
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
  
    // Wait for saving to complete
    await waitForElementToBeRemoved(() => queryByText(appointment, /saving/i));
  
    // Verify name was updated
    expect(getByText(appointment, "New Student Name")).toBeInTheDocument();
  
    // Verify spots remaining didn't change
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    
    const { container } = render(<Application />);
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Sylvia Palmer")
    );
    
    fireEvent.click(queryByAltText(appointment, "Edit"));
    
    fireEvent.change(
      getByPlaceholderText(appointment, /enter student name/i),
      { target: { value: "New Student Name" } }
    );
    
    fireEvent.click(getByText(appointment, "Save"));
    
    await findByText(appointment, "Could not save appointment");
    
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(queryByText(appointment, "Could not save appointment")).toBeNull();
  });
  
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    
    const { container } = render(<Application />);
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Sylvia Palmer")
    );
    
    fireEvent.click(queryByAltText(appointment, "Delete"));
    fireEvent.click(getByText(appointment, "Confirm"));
    
    await findByText(appointment, "Could not delete appointment");
    
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(queryByText(appointment, "Could not delete appointment")).toBeNull();
  });
});