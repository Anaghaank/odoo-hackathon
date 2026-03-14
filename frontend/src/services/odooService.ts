import axios from 'axios';

const ODOO_API_URL = 'http://localhost:8069';

export const signupOrganisation = async (details: {
  name: string;
  organisation: string;
  email: string;
  phone: string;
}) => {
  try {
    const response = await axios.post(`${ODOO_API_URL}/api/auth/signup`, {
      params: {
        name: details.name,
        organisation: details.organisation,
        email: details.email,
        phone: details.phone,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error.message || response.data.error);
    }

    return response.data.result;
  } catch (error: any) {
    console.error('Signup error:', error);
    throw error;
  }
};
