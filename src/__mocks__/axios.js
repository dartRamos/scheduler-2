const fixtures = {
  days: [
    {
      id: 1,
      name: "Monday",
      appointments: [1, 2],
      interviewers: [1, 2],
      spots: 1,
    },
    {
      id: 2,
      name: "Tuesday",
      appointments: [3, 4],
      interviewers: [3, 4],
      spots: 1,
    },
  ],
  appointments: {
    1: { id: 1, time: "12pm", interview: null },
    2: {
      id: 2,
      time: "1pm",
      interview: { student: "Archie Cohen", interviewer: 2 },
    },
    3: {
      id: 3,
      time: "2pm",
      interview: { student: "Leopold Silvers", interviewer: 4 },
    },
    4: { id: 4, time: "3pm", interview: null },
  },
  interviewers: {
    1: {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png",
    },
    2: {
      id: 2,
      name: "Tori Malcolm",
      avatar: "https://i.imgur.com/Nmx0Qxo.png",
    },
    3: {
      id: 3,
      name: "Mildred Nazir",
      avatar: "https://i.imgur.com/T2WwVfS.png",
    },
    4: {
      id: 4,
      name: "Cohana Roy",
      avatar: "https://i.imgur.com/FK8V841.jpg",
    },
  },
};

export default {
  get: jest.fn((url) => {
    if (url === "/api/days") {
      return Promise.resolve({ data: fixtures.days });
    }
    if (url === "/api/appointments") {
      return Promise.resolve({ data: fixtures.appointments });
    }
    if (url === "/api/interviewers") {
      return Promise.resolve({ data: fixtures.interviewers });
    }
  }),
  put: jest.fn((url, data) => {
    const appointmentId = url.split("/").pop();
    fixtures.appointments[appointmentId].interview = data.interview;
    fixtures.days[0].spots -= 1;
    return Promise.resolve({ status: 204 });
  }),
  delete: jest.fn((url) => {
    const appointmentId = url.split("/").pop();
    fixtures.appointments[appointmentId].interview = null;
    fixtures.days[0].spots += 1;
    return Promise.resolve({ status: 204 });
  })
};