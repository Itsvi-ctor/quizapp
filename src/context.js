import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
const API_ENDPOINT = "https://opentdb.com/api.php?";

const tempUrl =
  "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [form, setForm] = useState(true); //once user has filled the form
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [quiz, setQuiz] = useState({
    amount: 0,
    category: "sports",
    difficulty: "easy",
  });

  //url used to fetch the data
  //We used an inline if statement to convert each option to a number that would fetch that option's API
  //not our fault, it's the API's requirement :)
  const url = `https://opentdb.com/api.php?amount=${
    quiz.amount
  }&category=${(() => {
    switch (quiz.category) {
      case "sports":
        return 21;
      case "history":
        return 23;
      case "politics":
        return 24;
      default:
        return 21;
    }
  })()}&difficulty=${quiz.difficulty}&type=multiple`;
  const fetchQuestions = async (url) => {
    setLoading(true);
    setForm(false);
    const resp = await axios(url).catch((err) => console.log(err));
    if (resp) {
      const data = resp.data.results;
      if (data.length > 0) {
        setQuestions(data);
        setLoading(false);
        setForm(false);
        setError(false);
      } else {
        setForm(true);
        setError(true);
      }
    } else {
      setForm(true);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuiz({ ...quiz, [name]: value });
    setError(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchQuestions(url);
  };

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setForm(true);
    setCorrect(0);
    setModalOpen(false);
    setQuiz({
      amount: 0,
      category: "sports",
      difficulty: "easy",
    });
  };
  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1;
      return index;
    });
    if (index > questions.length - 2) {
      openModal();
      setIndex(0);
    } else {
      return index;
    }
  };

  const correctAnswer = (answer) => {
    if (answer === questions[index].correct_answer) {
      setCorrect(correct + 1);
      nextQuestion();
    } else {
      nextQuestion();
    }
  };

  return (
    <AppContext.Provider
      value={{
        form,
        loading,
        questions,
        index,
        correct,
        modalOpen,
        error,
        nextQuestion,
        correctAnswer,
        closeModal,
        quiz,
        handleChange,
        handleSubmit,
        setQuiz,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };