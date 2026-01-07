import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaChevronRight, FaChevronLeft, FaRedo } from 'react-icons/fa';
import api from '../utils/api';

const QuizView = ({ courseId, quizLesson, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: answer }
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const questions = quizLesson.quizData?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleSelectOption = (option) => {
        console.log("DEBUG: Selecting Option", { questionId: currentQuestion._id, option });
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion._id]: option
        });
    };

    const handleNext = (e) => {
        if (e) e.preventDefault();
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = (e) => {
        if (e) e.preventDefault();
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        console.log("DEBUG: handleSubmit triggered");

        setSubmitting(true);
        try {
            const answersArray = Object.entries(selectedAnswers).map(([questionId, answer]) => ({
                questionId,
                answer
            }));

            const url = `/courses/${courseId}/lessons/${quizLesson._id}/submit`;
            console.log("DEBUG: Submitting Quiz API Call", { url, answers: answersArray });

            const { data } = await api.post(url, {
                answers: answersArray
            });

            console.log("DEBUG: Quiz Result Received", data);
            setResult(data);
            if (data.passed) {
                onComplete();
            }
        } catch (error) {
            console.error("Quiz submission error:", error);
            alert("Failed to submit quiz. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetry = () => {
        setResult(null);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
    };

    if (result) {
        return (
            <div id="quiz-result-container" className="w-full max-w-2xl bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700 text-center animate-in fade-in zoom-in duration-300">
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${result.passed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {result.passed ? <FaCheckCircle className="text-4xl" /> : <FaTimesCircle className="text-4xl" />}
                </div>

                <h2 className="text-3xl font-bold mb-2">
                    {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
                </h2>
                <p className="text-gray-400 mb-8">
                    You scored <span className={`font-bold ${result.passed ? 'text-green-500' : 'text-red-500'}`}>{Math.round(result.score)}%</span>
                    ({result.correctCount} out of {result.totalQuestions} correct)
                </p>

                <div className="space-y-4">
                    {result.passed ? (
                        <p className="text-green-400 font-medium">You have passed this assessment and it has been marked as complete.</p>
                    ) : (
                        <p className="text-gray-400">Passing score: {quizLesson.quizData.passingScore}%</p>
                    )}

                    <button
                        id="quiz-retry-btn"
                        onClick={handleRetry}
                        className="w-full py-4 bg-gray-700 hover:bg-gray-600 rounded-2xl font-bold transition-all flex items-center justify-center"
                    >
                        <FaRedo className="mr-2" /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return <div className="text-gray-400">No questions available for this quiz.</div>;
    }

    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const allAnswered = Object.keys(selectedAnswers).length === questions.length;

    return (
        <form
            id="quiz-form"
            onSubmit={handleSubmit}
            className="w-full max-w-4xl bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden animate-in slide-in-from-bottom duration-500 mb-10"
        >
            {/* Progress Bar */}
            <div className="h-2 bg-gray-700 w-full">
                <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <div className="flex flex-col items-end text-[10px] text-gray-500 font-mono">
                        <div>Progress: {Object.keys(selectedAnswers).length} / {questions.length}</div>
                        <div>isLast: {isLastQuestion ? 'Y' : 'N'} | allAns: {allAnswered ? 'Y' : 'N'}</div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-8 leading-tight">
                    {currentQuestion.question}
                </h2>

                <div className="space-y-4 mb-10">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            id={`option-${idx}`}
                            type="button"
                            onClick={() => handleSelectOption(option)}
                            className={`w-full p-5 text-left rounded-2xl border-2 transition-all flex items-center ${selectedAnswers[currentQuestion._id] === option
                                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                                    : 'bg-gray-700/30 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:border-gray-600'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 text-xs font-bold ${selectedAnswers[currentQuestion._id] === option
                                    ? 'border-transparent bg-indigo-500 text-white'
                                    : 'border-gray-600 text-gray-500'
                                }`}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            {option}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <button
                        id="quiz-prev-btn"
                        type="button"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${currentQuestionIndex === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                    >
                        <FaChevronLeft className="mr-2" /> Previous
                    </button>

                    {isLastQuestion ? (
                        <button
                            id="quiz-submit-btn"
                            type="submit"
                            disabled={submitting || !allAnswered}
                            className={`px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all ${(submitting || !allAnswered) ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'
                                }`}
                        >
                            {submitting ? 'Submitting...' : 'Submit Quiz'}
                        </button>
                    ) : (
                        <button
                            id="quiz-next-btn"
                            type="button"
                            onClick={handleNext}
                            disabled={!selectedAnswers[currentQuestion._id]}
                            className={`flex items-center px-10 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all ${!selectedAnswers[currentQuestion._id] ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'
                                }`}
                        >
                            Next <FaChevronRight className="ml-2" />
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default QuizView;
