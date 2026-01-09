import React from 'react';
import { Typography, Row, Col, Card, Space, Badge, Progress, Button } from 'antd';
import { motion } from 'framer-motion';
import { FaBolt, FaTrophy, FaFire, FaChartLine, FaCheckCircle, FaStar, FaLevelUpAlt } from 'react-icons/fa';

const { Title, Paragraph, Text } = Typography;

const GamificationPreview = () => {
    return (
        <section className="py-32 bg-gray-950 text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Row gutter={[64, 64]} align="middle">
                    <Col xs={24} lg={10}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <Card
                                className="!bg-white/5 !backdrop-blur-2xl !border-white/10 !rounded-[40px] !shadow-2xl overflow-hidden"
                                bodyStyle={{ padding: '40px' }}
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl">
                                            <FaBolt className="text-white" />
                                        </div>
                                        <div>
                                            <Title level={3} className="!text-white !m-0 !font-black !tracking-tight">Level 24</Title>
                                            <Text className="!text-amber-400 !font-bold !uppercase !tracking-widest !text-[10px]">Elite Explorer</Text>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Text className="!text-gray-400 !font-bold !text-xs !block">Daily Streak</Text>
                                        <div className="flex items-center gap-2 text-2xl font-black text-orange-500">
                                            <FaFire /> 12 Days
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                            <Text className="!text-gray-400">XP Progress</Text>
                                            <Text className="!text-white">8,450 / 10,000</Text>
                                        </div>
                                        <Progress
                                            percent={84.5}
                                            showInfo={false}
                                            strokeColor={{ '0%': '#6366f1', '100%': '#a855f7' }}
                                            trailColor="rgba(255,255,255,0.05)"
                                            strokeWidth={12}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                            <FaTrophy className="text-2xl text-amber-400 mb-3" />
                                            <Title level={4} className="!text-white !m-0 !font-black">12</Title>
                                            <Text className="!text-gray-500 !text-[10px] !font-bold !uppercase">Badges Earned</Text>
                                        </div>
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                            <FaChartLine className="text-2xl text-indigo-400 mb-3" />
                                            <Title level={4} className="!text-white !m-0 !font-black">94%</Title>
                                            <Text className="!text-gray-500 !text-[10px] !font-bold !uppercase">Completion Rate</Text>
                                        </div>
                                    </div>
                                </div>

                                <Divider className="!border-white/10" />

                                <div className="space-y-4">
                                    <Text className="!text-gray-400 !font-bold !text-xs !uppercase !tracking-widest">Recent Achievements</Text>
                                    <div className="flex gap-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="w-12 h-12 bg-indigo-500/20 rounded-xl border border-indigo-500/30 flex items-center justify-center text-indigo-400 cursor-pointer"
                                            >
                                                <FaStar />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </Col>

                    <Col xs={24} lg={14}>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:pl-12"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
                                <FaLevelUpAlt className="text-indigo-400" />
                                <Text className="!text-indigo-400 !font-bold !uppercase !tracking-widest !text-[10px]">Level Up Your Learning</Text>
                            </div>
                            <Title className="!text-5xl lg:!text-6xl !font-black !tracking-tighter !text-white !mb-8">
                                Addicted to <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                    Getting Better.
                                </span>
                            </Title>
                            <Paragraph className="!text-xl !text-gray-400 !mb-12 !leading-relaxed !max-w-xl">
                                We've engineered a learning experience that feels like your favorite game. Earn XP, maintain streaks, and unlock exclusive rewards as you master new skills.
                            </Paragraph>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                                {[
                                    { icon: <FaFire className="text-orange-500" />, title: 'Daily Streaks', desc: 'Build habits that stick with daily learning goals.' },
                                    { icon: <FaTrophy className="text-amber-400" />, title: 'Milestone Rewards', desc: 'Unlock special perks as you reach key learning phases.' }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="text-3xl">{item.icon}</div>
                                        <Title level={4} className="!text-white !m-0 !font-bold">{item.title}</Title>
                                        <Text className="!text-gray-500">{item.desc}</Text>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                className="!h-14 !px-8 !rounded-xl !bg-indigo-600 !border-none !font-bold hover:!bg-indigo-700 transition-all"
                            >
                                Explore Gamification
                            </Button>
                        </motion.div>
                    </Col>
                </Row>
            </div>
        </section>
    );
};

export default GamificationPreview;
