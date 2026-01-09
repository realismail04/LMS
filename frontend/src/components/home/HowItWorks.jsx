import React from 'react';
import { Typography, Row, Col, Space, Divider } from 'antd';
import { motion } from 'framer-motion';
import { FaUserPlus, FaBookOpen, FaGraduationCap, FaArrowRight } from 'react-icons/fa';

const { Title, Paragraph, Text } = Typography;

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaUserPlus />,
            title: 'Create Your Account',
            desc: 'Join our community in seconds and set up your learning profile.',
            color: '#4f46e5'
        },
        {
            icon: <FaBookOpen />,
            title: 'Enroll and Learn',
            desc: 'Choose from hundreds of paths and learn from industry experts.',
            color: '#8b5cf6'
        },
        {
            icon: <FaGraduationCap />,
            title: 'Earn Your Certificate',
            desc: 'Complete projects, pass assessments, and get recognized globally.',
            color: '#ec4899'
        }
    ];

    return (
        <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Text className="!text-indigo-600 !font-bold !tracking-[0.3em] !uppercase !text-xs !mb-4 !block">Simple 3-Step Process</Text>
                        <Title className="!text-5xl !font-black !tracking-tighter !text-gray-900 !mb-6">How HaxoAcademy Works</Title>
                    </motion.div>
                </div>

                <div className="relative">
                    {/* Connection Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden lg:block" />

                    <Row gutter={[48, 48]} justify="center">
                        {steps.map((step, i) => (
                            <Col xs={24} md={12} lg={8} key={i}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className="relative z-10 text-center"
                                >
                                    <div
                                        className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-8 mx-auto shadow-xl group hover:scale-110 transition-transform duration-500 relative"
                                        style={{ backgroundColor: 'white', border: `4px solid ${step.color}`, color: step.color }}
                                    >
                                        {step.icon}
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                                            {i + 1}
                                        </div>
                                    </div>
                                    <Title level={3} className="!text-gray-900 !font-bold !mb-4 !tracking-tight">{step.title}</Title>
                                    <Paragraph className="!text-gray-500 !text-base !leading-relaxed !max-w-xs !mx-auto">
                                        {step.desc}
                                    </Paragraph>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
