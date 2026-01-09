import React from 'react';
import { Typography, Input, Button, Space, Row, Col, Card } from 'antd';
import { motion } from 'framer-motion';
import { FaArrowRight, FaBolt, FaRocket } from 'react-icons/fa6';

const { Title, Text, Paragraph } = Typography;

const FinalCTA = () => {
    return (
        <section className="py-0 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-900 rounded-[60px] p-12 lg:p-24 overflow-hidden text-center shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)]"
                >
                    {/* Background Orbs */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-sm font-bold mb-10">
                            <FaRocket className="text-indigo-400" />
                            <span className="uppercase tracking-widest text-xs">Ready to start?</span>
                        </div>

                        <Title className="!text-white !text-5xl lg:!text-7xl !font-black !tracking-tighter !mb-8">
                            Transform your future <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                starting today.
                            </span>
                        </Title>

                        <Paragraph className="!text-xl lg:!text-2xl !text-indigo-100/70 !font-medium !mb-16 !max-w-2xl !mx-auto">
                            Join 150,000+ others who are building their careers with HaxoAcademy. No credit card required to start.
                        </Paragraph>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button
                                type="primary"
                                size="large"
                                className="!h-20 !px-12 !rounded-3xl !bg-white !text-indigo-900 !text-xl !font-black hover:!bg-indigo-50 !border-none !flex !items-center !gap-3 !shadow-2xl transition-all"
                                icon={<FaArrowRight className="text-indigo-600" />}
                            >
                                <span className="flex-row-reverse flex items-center gap-3">Get Started Now</span>
                            </Button>

                            <Button
                                ghost
                                size="large"
                                className="!h-20 !px-12 !rounded-3xl !border-white/20 !text-white !text-xl !font-bold hover:!bg-white/10 transition-all"
                            >
                                Contact Sales
                            </Button>
                        </div>

                        <div className="mt-16 pt-16 border-t border-white/10">
                            <Row gutter={[32, 32]} justify="center">
                                {[
                                    { label: 'Satisfaction', value: '99%' },
                                    { label: 'Completion', value: '94%' },
                                    { label: 'Global Rank', value: '#1' }
                                ].map((item, i) => (
                                    <Col key={i}>
                                        <div className="px-8">
                                            <div className="text-3xl font-black text-white mb-2">{item.value}</div>
                                            <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{item.label}</div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Added spacing at bottom to let shadow breathe */}
            <div className="h-32" />
        </section>
    );
};

export default FinalCTA;
