import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1
            className="title-font sm:text-6xl text-5xl mb-4  font-semibold text-gray-900"
            style={{ fontFamily: "helvetica" }}
          >
            The best alternative
            <br className="hidden lg:inline-block" /> to notion
          </h1>
          <p
            className="text-3xl font-thin mb-3 text-zinc-700"
            style={{ fontFamily: "helvetica" }}
          >
            Set Goals. Plan. Write. Collaborate
          </p>
          <p className="mb-8 leading-relaxed">
            Boost your productivity with streamlined tools for tracking goals,
            managing tasks, and staying organized. Simplify your workflow,
            achieve milestones, and make progress every day, all in one
            intuitive platform.
          </p>
          <div className="flex justify-center">
            <button
              className="inline-flex text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg"
              onClick={() => {
                navigate("/register");
              }}
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <img
            className="object-cover object-center rounded"
            alt="hero"
            src="/creative-interaction.svg"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
