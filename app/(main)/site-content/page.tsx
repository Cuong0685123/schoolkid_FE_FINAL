'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import {
    createSiteContent,
    getSiteContents,
    updateSiteContent,
    type SiteContent
} from '../../../demo/service/SiteContentService';

export default function SiteContentPage() {
    const toast = useRef<Toast>(null);

    const [record, setRecord] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [id, setId] = useState<number>(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [supportEmail, setSupportEmail] = useState('');
    const [address, setAddress] = useState('');
    const [admissionPeriod, setAdmissionPeriod] = useState('');
    const [statYearsExperience, setStatYearsExperience] = useState('');
    const [statStudentsInfo, setStatStudentsInfo] = useState('');
    const [statAwardsInfo, setStatAwardsInfo] = useState('');
    const [footerDescription, setFooterDescription] = useState('');
    const [aboutSectionQuote, setAboutSectionQuote] = useState('');
const [heroImageUrl, setHeroImageUrl] = useState('');
const [aboutImageUrl, setAboutImageUrl] = useState('');
    const fillForm = (data: SiteContent) => {
        setRecord(data);
        setId(data.id || 1);
        setPhoneNumber(data.phone_number || '');
        setSupportEmail(data.support_email || '');
        setAddress(data.address || '');
        setAdmissionPeriod(data.admission_period || '');
        setStatYearsExperience(data.stat_years_experience || '');
        setStatStudentsInfo(data.stat_students_info || '');
        setStatAwardsInfo(data.stat_awards_info || '');
        setFooterDescription(data.footer_description || '');
        setAboutSectionQuote(data.about_section_quote || '');
        setHeroImageUrl(data.hero_image_url || '');
setAboutImageUrl(data.about_image_url || '');
        
    };

    const loadSiteContent = async () => {
        try {
            setLoading(true);

            const data = await getSiteContents();

            if (Array.isArray(data) && data.length > 0) {
                fillForm(data[0]);
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Failed to load site content',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSiteContent();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);

            const payload = {
                id,
                phone_number: phoneNumber.trim(),
                support_email: supportEmail.trim(),
                address: address.trim(),
                admission_period: admissionPeriod.trim(),
                stat_years_experience: statYearsExperience.trim(),
                stat_students_info: statStudentsInfo.trim(),
                stat_awards_info: statAwardsInfo.trim(),
                footer_description: footerDescription.trim(),
                about_section_quote: aboutSectionQuote.trim(),
                hero_image_url: heroImageUrl.trim(),
about_image_url: aboutImageUrl.trim()
            };

            if (record) {
                const response: any = await updateSiteContent(record.id, payload);
                const updated = response?.data || response || payload;

                fillForm(updated);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Site content updated',
                    life: 3000
                });
            } else {
                const response: any = await createSiteContent(payload);
                const created = response?.data || response || payload;

                fillForm(created);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Site content created',
                    life: 3000
                });
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Unable to save site content',
                life: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="card">
                <Toast ref={toast} />
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div className="card">
            <Toast ref={toast} />

            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="m-0">Site Content</h2>
                    <p className="text-500 mt-2 mb-0">
                        Manage public website contact, statistics and footer content.
                    </p>
                </div>

                <Button
                    label={record ? 'Save Changes' : 'Create Content'}
                    icon="pi pi-save"
                    loading={saving}
                    onClick={handleSave}
                />
            </div>

            <div className="grid">
                <div className="col-12 md:col-4">
                    <label htmlFor="id" className="block mb-2 font-bold">
                        ID
                    </label>
                    <InputText
                        id="id"
                        value={String(id)}
                        disabled={!!record || saving}
                        onChange={(event) => setId(Number(event.target.value) || 1)}
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-4">
                    <label htmlFor="phoneNumber" className="block mb-2 font-bold">
                        Phone Number
                    </label>
                    <InputText
                        id="phoneNumber"
                        value={phoneNumber}
                        disabled={saving}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-4">
                    <label htmlFor="supportEmail" className="block mb-2 font-bold">
                        Support Email
                    </label>
                    <InputText
                        id="supportEmail"
                        value={supportEmail}
                        disabled={saving}
                        onChange={(event) => setSupportEmail(event.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="col-12">
                    <label htmlFor="address" className="block mb-2 font-bold">
                        Address
                    </label>
                    <InputText
                        id="address"
                        value={address}
                        disabled={saving}
                        onChange={(event) => setAddress(event.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-4">
                    <label htmlFor="admissionPeriod" className="block mb-2 font-bold">
                        Admission Period
                    </label>
                    <InputText
                        id="admissionPeriod"
                        value={admissionPeriod}
                        disabled={saving}
                        onChange={(event) => setAdmissionPeriod(event.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-4">
                    <label htmlFor="statYearsExperience" className="block mb-2 font-bold">
                        Years Experience
                    </label>
                    <InputText
                        id="statYearsExperience"
                        value={statYearsExperience}
                        disabled={saving}
                        onChange={(event) => setStatYearsExperience(event.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-4">
                    <label htmlFor="statStudentsInfo" className="block mb-2 font-bold">
                        Students Info
                    </label>
                    <InputText
                        id="statStudentsInfo"
                        value={statStudentsInfo}
                        disabled={saving}
                        onChange={(event) => setStatStudentsInfo(event.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-4">
                    <label htmlFor="statAwardsInfo" className="block mb-2 font-bold">
                        Awards Info
                    </label>
                    <InputText
                        id="statAwardsInfo"
                        value={statAwardsInfo}
                        disabled={saving}
                        onChange={(event) => setStatAwardsInfo(event.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="col-12">
                    <label htmlFor="footerDescription" className="block mb-2 font-bold">
                        Footer Description
                    </label>
                    <InputTextarea
                        id="footerDescription"
                        value={footerDescription}
                        disabled={saving}
                        onChange={(event) => setFooterDescription(event.target.value)}
                        rows={5}
                        className="w-full"
                    />
                </div>
                <div className="col-12 md:col-6">
    <label htmlFor="heroImageUrl" className="block mb-2 font-bold">
        Hero Image URL
    </label>
    <InputText
        id="heroImageUrl"
        value={heroImageUrl}
        disabled={saving}
        onChange={(event) => setHeroImageUrl(event.target.value)}
        className="w-full"
        placeholder="https://drive.google.com/thumbnail?id=..."
    />

    {heroImageUrl ? (
        <img
            src={heroImageUrl}
            alt="Hero Preview"
            style={{
                width: '100%',
                maxHeight: 180,
                objectFit: 'cover',
                borderRadius: 12,
                marginTop: 12
            }}
        />
    ) : null}
</div>

<div className="col-12 md:col-6">
    <label htmlFor="aboutImageUrl" className="block mb-2 font-bold">
        About Image URL
    </label>
    <InputText
        id="aboutImageUrl"
        value={aboutImageUrl}
        disabled={saving}
        onChange={(event) => setAboutImageUrl(event.target.value)}
        className="w-full"
        placeholder="https://drive.google.com/thumbnail?id=..."
    />

    {aboutImageUrl ? (
        <img
            src={aboutImageUrl}
            alt="About Preview"
            style={{
                width: '100%',
                maxHeight: 180,
                objectFit: 'cover',
                borderRadius: 12,
                marginTop: 12
            }}
        />
    ) : null}
</div>

                <div className="col-12">
                    <label htmlFor="aboutSectionQuote" className="block mb-2 font-bold">
                        About Section Quote
                    </label>
                    <InputTextarea
                        id="aboutSectionQuote"
                        value={aboutSectionQuote}
                        disabled={saving}
                        onChange={(event) => setAboutSectionQuote(event.target.value)}
                        rows={5}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}