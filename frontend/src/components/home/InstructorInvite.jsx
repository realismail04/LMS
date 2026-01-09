import React, { useState } from 'react';
import { Row, Col, Typography, Card, Button, Slider, InputNumber, Space, Statistic, Divider } from 'antd';
import { motion } from 'framer-motion';
import { FaChalkboard, FaArrowRight, FaUsers, FaGraduationCap, FaWallet, FaGlobe } from 'react-icons/fa6';

const { Title, Text, Paragraph } = Typography;

const InstructorInvite = () => {
    const [students, setStudents] = useState(100);
    const price = 49;
    const potentialEarning = Math.floor(students * price * 0.7); // 70% share

    return (
        <section className="py-32 bg-gray-50 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Row gutter={[64, 64]} align="middle">
                    <Col xs={24} lg={12}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <Text className="!text-indigo-600 !font-bold !tracking-[0.3em] !uppercase !text-xs !mb-4 !block">Join our Ecosystem</Text>
                            <Title className="!text-5xl !font-black !tracking-tighter !text-gray-900 !mb-8">
                                Teach the next <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    generation of makers.
                                </span>
                            </Title>
                            <Paragraph className="!text-lg !text-gray-600 !mb-10 !leading-relaxed">
                                Share your expertise with a global audience and build your professional brand. We provide the tools, you provide the knowledge.
                            </Paragraph>

                            <div className="grid grid-cols-2 gap-8 mb-12">
                                {[
                                    { icon: <FaUsers />, title: '150K+', desc: 'Active Students' },
                                    { icon: <FaGlobe />, title: 'Global', desc: 'Reach 85+ countries' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <div className="text-indigo-600 text-3xl">{item.icon}</div>
                                        <div>
                                            <Title level={4} className="!m-0 !text-gray-900 !font-bold">{item.title}</Title>
                                            <Text className="text-gray-500 text-xs font-bold uppercase">{item.desc}</Text>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                icon={<FaArrowRight />}
                                className="!h-16 !px-10 !rounded-2xl !bg-gray-900 !border-none !text-lg !font-bold !flex !flex-row-reverse !items-center !gap-3 hover:!bg-indigo-600 transition-all"
                            >
                                Start Teaching Today
                            </Button>
                        </motion.div>
                    </Col>

                    <Col xs={24} lg={12}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <Card
                                className="!border-none !shadow-2xl !rounded-[40px] !p-8"
                                title={
                                    <div className="flex items-center gap-3 py-2">
                                        <FaWallet className="text-indigo-600 text-2xl" />
                                        <span className="text-xl font-black text-gray-900 tracking-tight">Earning Simulator</span>
                                    </div>
                                }
                            >
                                <Space direction="vertical" size="large" className="w-full">
                                    <div>
                                        <Text className="!text-gray-400 !font-bold !uppercase !text-[10px] !tracking-widest !block !mb-4">Potential Students</Text>
                                        <Row align="middle" gutter={20}>
                                            <Col flex="auto">
                                                <Slider
                                                    min={10}
                                                    max={5000}
                                                    onChange={setStudents}
                                                    value={students}
                                                    trackStyle={{ backgroundColor: '#4f46e5' }}
                                                    handleStyle={{ borderColor: '#4f46e5', backgroundColor: '#fff' }}
                                                />
                                            </Col>
                                            <Col flex="100px">
                                                <InputNumber
                                                    min={10}
                                                    max={5000}
                                                    value={students}
                                                    onChange={setStudents}
                                                    className="w-full !rounded-lg !font-bold"
                                                />
                                            </Col>
                                        </Row>
                                    </div>

                                    <Divider className="!m-0" />

                                    <div className="text-center py-6">
                                        <Text className="!text-gray-500 !font-medium !text-base">You could earn up to</Text>
                                        <div className="text-6xl font-black text-gray-900 my-4 tracking-tighter">
                                            ${potentialEarning.toLocaleString()}
                                            <span className="text-lg text-gray-400 ml-2 font-bold uppercase tracking-widest">/ Month*</span>
                                        </div>
                                        <Paragraph className="!text-xs !text-gray-400 !font-medium !mt-4">
                                            *Based on a course price of $49 and standard 70% instructor revenue share.
                                        </Paragraph>
                                    </div>
                                </Space>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </div>
        </section>
    );
};

export default InstructorInvite;
