import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AnnouncementService, { AnnouncementDTO } from '../../service/announcement.service';
import { useNavigate } from 'react-router-dom';

const AddAnnouncementPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .max(100, 'Tytuł nie może przekraczać 100 znaków')
                .required('Tytuł jest wymagany'),
            content: Yup.string()
                .max(1000, 'Treść nie może przekraczać 1000 znaków')
                .required('Treść jest wymagana'),
        }),
        onSubmit: async (values, { resetForm }) => {
            const announcementData: AnnouncementDTO = {
                title: values.title,
                content: values.content,
            };

            console.log('Przygotowanie żądania do /announcement/add:', announcementData);

            try {
                await AnnouncementService.addAnnouncement(announcementData);
                alert('Ogłoszenie zostało dodane pomyślnie!');
                resetForm();
                navigate('/announcements');
            } catch (error: any) {
                console.error('Błąd podczas dodawania ogłoszenia:', error);
                alert('Nie udało się dodać ogłoszenia. Spróbuj ponownie później.');
            }
        },
    });

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-4">Dodaj Ogłoszenie</h1>
            <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                        Tytuł
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Wpisz tytuł ogłoszenia"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.title}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            formik.touched.title && formik.errors.title ? 'border-red-500' : ''
                        }`}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <p className="text-red-500 text-xs italic">{formik.errors.title}</p>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label htmlFor="content" className="block text-gray-700 font-bold mb-2">
                        Treść
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Wpisz treść ogłoszenia"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.content}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            formik.touched.content && formik.errors.content ? 'border-red-500' : ''
                        }`}
                        rows={5}
                    ></textarea>
                    {formik.touched.content && formik.errors.content ? (
                        <p className="text-red-500 text-xs italic">{formik.errors.content}</p>
                    ) : null}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Dodaj Ogłoszenie
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/announcements')}
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                        Anuluj
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAnnouncementPage;
