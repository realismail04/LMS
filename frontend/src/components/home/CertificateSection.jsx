import React, { useState } from 'react';
import { Row, Col, Card, Typography, ColorPicker, Input, Select, Space, Button, Badge, Tag, Divider, QRCode } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCertificate, FaPalette, FaSignature, FaFont, FaImage, FaCheckCircle, FaLinkedin, FaShareAlt } from 'react-icons/fa';

const { Title, Paragraph, Text } = Typography;

const CertificateSection = () => {
    const [color, setColor] = useState('#4f46e5');
    const [font, setFont] = useState('Inter');
    const [studentName, setStudentName] = useState('Jane Doe');
    const [signature, setSignature] = useState('John Instructor');

    const fonts = [
        { label: 'Inter', value: 'Inter, sans-serif' },
        { label: 'Playfair Display', value: '"Playfair Display", serif' },
        { label: 'Montserrat', value: 'Montserrat, sans-serif' },
        { label: 'Sacramento (Script)', value: 'Sacramento, cursive' }
    ];

    return (
        <section className="py-32 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Row gutter={[64, 64]} align="middle">
                    <Col xs={24} lg={12}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <Badge status="processing" text={<Text className="!text-indigo-600 !font-bold !tracking-widest !uppercase !text-xs">Premium Feature</Text>} className="mb-6" />
                            <Title className="!text-5xl !font-black !tracking-tighter !text-gray-900 !mb-8">
                                Industry-Grade <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    Verifiable Certificates
                                </span>
                            </Title>
                            <Paragraph className="!text-lg !text-gray-600 !mb-10 !leading-relaxed">
                                Our certificates are more than just paper. They are cryptographically verifiable, shareable on LinkedIn, and fully customizable to match your brand's identity.
                            </Paragraph>

                            <div className="space-y-6">
                                {[
                                    { icon: <FaCheckCircle />, title: 'Verifiable ID', desc: 'Every certificate has a unique ID and QR code.' },
                                    { icon: <FaLinkedin />, title: 'One-Click Add to LinkedIn', desc: 'Boost your profile credibility instantly.' },
                                    { icon: <FaShareAlt />, title: 'Global Recognition', desc: 'Accepted by leading companies worldwide.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="mt-1 text-indigo-600 text-xl">{item.icon}</div>
                                        <div>
                                            <Title level={5} className="!mb-1 !text-gray-900 !font-bold">{item.title}</Title>
                                            <Text className="text-gray-500">{item.desc}</Text>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Divider className="my-10" />

                            <Card className="!bg-indigo-600 !border-none !rounded-3xl !shadow-xl">
                                <Space direction="vertical" size="middle" className="w-full">
                                    <Title level={4} className="!text-white !m-0 !font-bold">Try Customizing Your Sample</Title>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Text className="!text-white/70 !text-[10px] !uppercase !font-bold !mb-2 !block">Brand Color</Text>
                                            <ColorPicker value={color} onChange={(val) => setColor(val.toHexString())} showText />
                                        </div>
                                        <div>
                                            <Text className="!text-white/70 !text-[10px] !uppercase !font-bold !mb-2 !block">Primary Font</Text>
                                            <Select
                                                defaultValue="Inter"
                                                className="w-full"
                                                options={fonts}
                                                onChange={(val) => setFont(val)}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Text className="!text-white/70 !text-[10px] !uppercase !font-bold !mb-2 !block">Instructor Signature</Text>
                                            <Input
                                                value={signature}
                                                onChange={(e) => setSignature(e.target.value)}
                                                prefix={<FaSignature className="text-gray-400" />}
                                                className="!rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </Space>
                            </Card>
                        </motion.div>
                    </Col>

                    <Col xs={24} lg={12}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            {/* Certificate Mockup */}
                            <div
                                className="aspect-[1.414/1] bg-white rounded-lg shadow-2xl p-12 border-[12px] relative overflow-hidden transition-all duration-500"
                                style={{
                                    borderColor: color,
                                    fontFamily: font
                                }}
                            >
                                {/* Deco Elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-10" style={{ backgroundColor: color, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                                <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10" style={{ backgroundColor: color, clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />

                                <div className="h-full flex flex-col items-center justify-between text-center">
                                    <div className="flex flex-col items-center">
                                        <FaCertificate className="text-4xl mb-4" style={{ color }} />
                                        <Text className="uppercase tracking-[0.3em] font-bold text-gray-400 text-xs">Certificate of Completion</Text>
                                    </div>

                                    <div className="space-y-4">
                                        <Text className="text-gray-500 text-sm">This is to certify that</Text>
                                        <Title className="!m-0 !text-gray-900 !text-4xl !font-black !tracking-tight">
                                            {studentName}
                                        </Title>
                                        <Text className="text-gray-500 text-sm block max-w-sm mx-auto">
                                            has successfully completed the intensive path in <br />
                                            <Text className="font-bold text-gray-900">Advanced Product Engineering</Text>
                                        </Text>
                                    </div>

                                    <div className="w-full flex justify-between items-end mt-8">
                                        <div className="text-left">
                                            <Text className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-2">Instructor</Text>
                                            <Text className="text-2xl" style={{ fontFamily: '"Sacramento", cursive', color }}>
                                                {signature}
                                            </Text>
                                            <div className="w-32 h-[1px] bg-gray-200 mt-2" />
                                        </div>

                                        {/* QR Code Placeholder */}
                                        <div className="flex flex-col items-center gap-2">
                                            <QRCode value="https://haxoacademy.com/verify/12345" size={60} bordered={false} color={color} />
                                            <Text className="text-[8px] text-gray-400 font-bold uppercase">ID: HAXO-9921-X</Text>
                                        </div>

                                        <div className="text-right">
                                            <Text className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-2">Date</Text>
                                            <Text className="text-xs font-bold text-gray-900">October 24, 2025</Text>
                                            <div className="w-32 h-[1px] bg-gray-200 mt-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Blur */}
                            <div className="absolute -inset-10 bg-indigo-500/10 blur-3xl -z-10 rounded-full" />
                        </motion.div>
                    </Col>
                </Row>
            </div>
        </section>
    );
};

export default CertificateSection;
