import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Row, Col, Space, Input, Button } from 'antd';
import { FaGraduationCap, FaArrowRight, FaLinkedin, FaTwitter, FaGithub, FaYoutube } from 'react-icons/fa';

const { Title, Text, Paragraph } = Typography;

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-white pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Row gutter={[48, 48]} className="mb-24">
                    <Col xs={24} lg={8}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                <FaGraduationCap size={24} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase">HaxoAcademy</span>
                        </div>
                        <Paragraph className="!text-gray-500 !font-medium !mb-10 !leading-relaxed !max-w-sm">
                            Redefining the digital learning experience through high-fidelity curricula, gamified progress, and verifiable expertise.
                        </Paragraph>
                        <div className="flex gap-4">
                            {[<FaLinkedin />, <FaTwitter />, <FaGithub />, <FaYoutube />].map((icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </Col>

                    <Col xs={12} md={6} lg={4}>
                        <Title level={5} className="!text-white !font-black !uppercase !tracking-[0.2em] !text-[10px] !mb-8">Platform</Title>
                        <ul className="space-y-4 list-none p-0">
                            <li><Link to="/courses" className="text-gray-500 hover:text-white transition-colors font-medium">Marketplace</Link></li>
                            <li><Link to="/teachers" className="text-gray-500 hover:text-white transition-colors font-medium">Instructors</Link></li>
                            <li><a href="#" className="text-gray-500 hover:text-white transition-colors font-medium">For Organizations</a></li>
                        </ul>
                    </Col>

                    <Col xs={12} md={6} lg={4}>
                        <Title level={5} className="!text-white !font-black !uppercase !tracking-[0.2em] !text-[10px] !mb-8">Support</Title>
                        <ul className="space-y-4 list-none p-0">
                            <li><a href="#" className="text-gray-500 hover:text-white transition-colors font-medium">Documentation</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-white transition-colors font-medium">Verify Certificate</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-white transition-colors font-medium">Success Stories</a></li>
                        </ul>
                    </Col>

                    <Col xs={24} md={12} lg={8}>
                        <Title level={5} className="!text-white !font-black !uppercase !tracking-[0.2em] !text-[10px] !mb-8">Join the Newsletter</Title>
                        <Paragraph className="!text-gray-500 !font-medium !mb-8">
                            Get weekly insights on career growth and new path announcements.
                        </Paragraph>
                        <div className="flex gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl focus-within:border-indigo-600 transition-all">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-transparent border-none outline-none px-4 flex-grow text-white font-medium text-sm"
                            />
                            <Button size="large" className="!h-12 !px-6 !rounded-xl !bg-indigo-600 !border-none !text-white !flex !items-center !justify-center">
                                <FaArrowRight />
                            </Button>
                        </div>
                    </Col>
                </Row>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <Text className="!text-gray-600 !font-bold !text-[10px] !uppercase !tracking-widest">
                        © 2026 HaxoAcademy. Engineered for Excellence.
                    </Text>
                    <div className="flex gap-8">
                        <a href="#" className="text-gray-600 hover:text-gray-400 text-[10px] font-bold uppercase tracking-widest transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-600 hover:text-gray-400 text-[10px] font-bold uppercase tracking-widest transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
