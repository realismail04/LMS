import React from 'react';
import { Typography, Row, Col, Card, Space, Statistic, Avatar } from 'antd';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCode, FaChartBar, FaDesktop, FaMobileAlt, FaUserEdit, FaGlobe, FaCertificate } from 'react-icons/fa';

const { Title, Paragraph, Text } = Typography;

const PlatformFeatures = () => {
    const features = [
        {
            icon: <FaDesktop />,
            title: 'Learn at your pace',
            desc: 'Unlimited access to high-quality content, anywhere, anytime.',
            color: '#4f46e5'
        },
        {
            icon: <FaCode />,
            title: 'Real-world projects',
            desc: 'Build portfolio-ready projects that impress employers.',
            color: '#10b981'
        },
        {
            icon: <FaGraduationCap />,
            title: 'Expert instructors',
            desc: 'Learn directly from industry veterans and top developers.',
            color: '#f59e0b'
        },
        {
            icon: <FaCertificate />,
            title: 'Verified Certificates',
            desc: 'Earn industry-recognized credentials for every path.',
            color: '#ef4444'
        },
        {
            icon: <FaMobileAlt />,
            title: 'Mobile friendly',
            desc: 'Seamless learning experience across all devices.',
            color: '#8b5cf6'
        },
        {
            icon: <FaGlobe />,
            title: 'Global Community',
            desc: 'Connect with thousands of learners worldwide.',
            color: '#3b82f6'
        }
    ];

    return (
        <section id="features" className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Text className="!text-indigo-600 !font-bold !tracking-[0.3em] !uppercase !text-xs !mb-4 !block">Built for Success</Text>
                        <Title className="!text-5xl !font-black !tracking-tighter !text-gray-900 !mb-6">Everything you need to <br /> scale your skills.</Title>
                        <Paragraph className="!text-lg !text-gray-500 !max-w-2xl !mx-auto !font-medium">
                            A comprehensive ecosystem designed to take you from a curious beginner to a professional expert.
                        </Paragraph>
                    </motion.div>
                </div>

                <Row gutter={[32, 32]}>
                    {features.map((feature, i) => (
                        <Col xs={24} sm={12} lg={8} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card
                                    className="!border-none !shadow-sm hover:!shadow-2xl hover:!-translate-y-2 !transition-all !duration-500 !rounded-[32px] !bg-gray-50 group"
                                    bodyStyle={{ padding: '48px 40px' }}
                                >
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                                        style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                                    >
                                        {feature.icon}
                                    </div>
                                    <Title level={3} className="!text-gray-900 !font-bold !mb-4 !tracking-tight">
                                        {feature.title}
                                    </Title>
                                    <Paragraph className="!text-gray-500 !text-base !leading-relaxed !m-0 !font-medium">
                                        {feature.desc}
                                    </Paragraph>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
};

export default PlatformFeatures;
