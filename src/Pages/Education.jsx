import React from "react";
import Layout from "../components/Layout/Layout";
import EdCard from "../components/EdCard/EdCard";

const Education = () => {
  const courses = [
    {
      id: 1,
      title: "Organic Farming Techniques",
      description: "Learn about sustainable farming practices that eliminate the use of synthetic pesticides and fertilizers, improve soil health, and produce high-quality organic crops.",
      instructor: "Dr. Ramesh Sharma",
      level: "Intermediate",
      enrolled: 120,
      imageUrl:"https://images.unsplash.com/photo-1475948164756-9a56289068fb?q=80&w=1420&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 2,
      title: "Smart Irrigation Management",
      description: "Discover advanced irrigation strategies using sensor technologies, data analytics, and automation to optimize water usage, increase crop yields, and reduce water wastage.",
      instructor: "Dr. Priya Singh",
      level: "Advanced",
      enrolled: 90,
      imageUrl:"https://images.unsplash.com/photo-1692369584496-3216a88f94c1?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 3,
      title: "Agroforestry Practices for Sustainable Agriculture",
      description: "Explore integrated farming systems that combine tree cultivation with traditional crops to enhance biodiversity, improve soil fertility, and create resilient agroecosystems.",
      instructor: "Prof. Ajay Kumar",
      level: "Intermediate",
      enrolled: 80,
      imageUrl:"https://images.unsplash.com/photo-1471532027614-154d124ccf57?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 4,
      title: "Precision Agriculture Technologies",
      description: "Gain insights into precision farming techniques leveraging GPS, drones, IoT sensors, and machine learning algorithms to optimize resource utilization, monitor crop health, and maximize productivity.",
      instructor: "Dr. Neha Gupta",
      level: "Advanced",
      enrolled: 110,
      imageUrl:"https://images.unsplash.com/photo-1527847263472-aa5338d178b8?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];
  


  return (
    <Layout>
      <div className="w-full dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Education Tab in Agritech
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Explore educational resources and insights in agricultural
              technology.
            </p>
          </div>
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 sm:mt-0 lg:mx-0 lg:max-w-none lg:grid-cols-1 ">
            {courses.map((course) => (
              <EdCard
                key={course.id}
                title={course.title}
                description={course.description}
                instructor={course.instructor}
                level={course.level}
                enrolled={course.enrolled}
                imageUrl={course.imageUrl}
              />
            ))}
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Education;
