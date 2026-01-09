import React from 'react';
import { Row, Col, Typography, Card, Button, Avatar, Space, Statistic, Tag } from 'antd';
import { motion } from 'framer-motion';
import { FaArrowRight, FaClock, FaSignal, FaCertificate, FaArrowTrendUp } from 'react-icons/fa6';

const { Title, Text, Paragraph } = Typography;

const LearningPaths = () => {
    const paths = [
        {
            title: 'Full-Stack Web Development',
            desc: 'Master the entire stack from HTML/CSS to React, Node.js, and Cloud Deployment.',
            skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
            time: '6 Months',
            level: 'Beginner to Pro',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            color: '#4f46e5'
        },
        {
            title: 'AI & Data Science',
            desc: 'Dive into Machine Learning, Python, and Big Data to build intelligent systems.',
            skills: ['Python', 'TensorFlow', 'SQL', 'NLP'],
            time: '8 Months',
            level: 'Intermediate',
            image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            color: '#8b5cf6'
        },
        {
            title: 'UI/UX Product Design',
            desc: 'Learn the principles of human-centered design and master Figma for modern interfaces.',
            skills: ['Figma', 'Prototyping', 'User Research'],
            time: '4 Months',
            level: 'Beginner',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            color: '#ec4899'
        }
    ];

    return (
        <section id="paths" className="py-32 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Text className="!text-indigo-600 !font-bold !tracking-[0.3em] !uppercase !text-xs !mb-4 !block">Curated Career Paths</Text>
                        <Title className="!text-5xl !font-black !tracking-tighter !text-gray-900 !max-w-xl">Accelerate your journey <br /> to expertise.</Title>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Button
                            type="primary"
                            size="large"
                            className="!h-16 !px-10 !rounded-2xl !bg-white !border-2 !border-gray-200 !text-gray-900 !font-bold hover:!border-indigo-600 transition-all flex items-center gap-2"
                            icon={<FaArrowRight />}
                        >
                            View All Paths
                        </Button>
                    </motion.div>
                </div>

                <Row gutter={[32, 32]}>
                    {paths.map((path, i) => (
                        <Col xs={24} lg={8} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card
                                    className="!border-none !shadow-lg hover:!shadow-2xl transition-all duration-500 !rounded-[40px] overflow-hidden group"
                                    bodyStyle={{ padding: 0 }}
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img src={path.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={path.title} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white">
                                            <div className="flex items-center gap-2">
                                                <FaClock />
                                                <Text className="!text-white !font-bold !text-xs !uppercase">{path.time}</Text>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaSignal />
                                                <Text className="!text-white !font-bold !text-xs !uppercase">{path.level}</Text>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 pb-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <FaCertificate className="text-amber-400" />
                                            <Text className="!text-gray-400 !font-bold !text-[10px] !uppercase !tracking-widest">Certificate Included</Text>
                                        </div>

                                        <Title level={3} className="!text-gray-900 !font-black !mb-4 !tracking-tight !min-h-[64px]">
                                            {path.title}
                                        </Title>

                                        <Paragraph className="!text-gray-500 !font-medium !mb-8 !line-clamp-2 !text-base">
                                            {path.desc}
                                        </Paragraph>

                                        <div className="flex flex-wrap gap-2 mb-10">
                                            {path.skills.map(skill => (
                                                <Tag key={skill} className="!px-4 !py-1 !rounded-full !bg-gray-100 !border-none !text-gray-600 !font-bold !text-xs uppercase">
                                                    {skill}
                                                </Tag>
                                            ))}
                                        </div>

                                        <Button
                                            block
                                            size="large"
                                            className="!h-14 !rounded-2xl !bg-gray-50 !border-none !text-gray-900 !font-bold hover:!bg-indigo-600 hover:!text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            View Path <FaArrowRight />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
};

export default LearningPaths;
