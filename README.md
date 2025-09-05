# Oma Khair - Hair & Makeup Booking Website

A modern, responsive booking website for hair and makeup appointments built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🎨 **Beautiful UI/UX**
- Modern, responsive design with gradient backgrounds
- Intuitive booking flow with progress indicators
- Mobile-first design approach
- Professional color scheme (rose/pink theme)

### 📅 **Smart Booking System**
- **2-hour minimum gap** between appointments
- Real-time availability checking
- Multi-service selection
- Date and time validation
- Business hours management

### 💇‍♀️ **Hair & Makeup Services**
- Frontal Installation ($250, 3 hours)
- Corn Rows ($80, 2 hours)
- Braids ($150, 4 hours)
- Wig Making ($400, 5 hours)
- Wig Revamping ($120, 2.5 hours)
- Hair Coloring ($200, 3 hours)
- Gel Pack Up ($45, 1 hour)

### 🗓️ **Google Calendar Integration**
- Automatic event creation
- Customer email invitations
- Appointment reminders
- Event updates and deletions

### 👨‍💼 **Admin Dashboard**
- View all bookings with filters
- Real-time statistics
- Apply discounts to bookings
- Update booking status
- Export functionality (ready for implementation)
- Popular services analytics

### 📊 **Data Management**
- JSON-based service configuration
- Structured data for easy backend migration
- Customer information management
- Booking history tracking

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Headless UI
- **Icons**: Lucide React
- **Date Handling**: date-fns, react-day-picker
- **Calendar Integration**: Google Calendar API
- **State Management**: React hooks + localStorage

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Console account (for calendar integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oma-khair
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional)
   ```bash
   cp env.template .env.local
   ```
   
   Fill in your Google Calendar credentials if you want calendar integration.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Google Calendar Setup (Optional)

To enable automatic calendar event creation:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API
4. Create a service account
5. Download the JSON credentials file
6. Extract the `client_email` and `private_key` values
7. Add them to your `.env.local` file

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── book/              # Booking flow
│   ├── api/               # API routes
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   └── ServiceCard.tsx    # Service display component
├── data/                  # JSON data files
│   └── services.json      # Service definitions
├── lib/                   # Utility functions
│   ├── utils.ts           # General utilities
│   └── google-calendar.ts # Calendar integration
└── types/                 # TypeScript definitions
    └── index.ts           # Type definitions
```

## Data Structure

### Services
```json
{
  "id": "service-id",
  "name": "Service Name",
  "description": "Service description",
  "duration": 120,
  "price": 150,
  "category": "hair",
  "image": "/path/to/image.jpg"
}
```

### Bookings
```typescript
interface Booking {
  id: string;
  customerId: string;
  customer: Customer;
  serviceIds: string[];
  services: Service[];
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  totalPrice: number;
  discountAmount?: number;
  finalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  googleCalendarEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Features in Detail

### Booking Flow
1. **Service Selection**: Choose one or more services
2. **Date & Time**: Pick available date and time slots
3. **Customer Info**: Enter contact details and notes
4. **Confirmation**: Review and confirm booking

### Admin Features
- **Dashboard Statistics**: Total bookings, today's bookings, revenue
- **Booking Management**: View, edit, update status, apply discounts
- **Filtering**: Search by customer, service, status, or date
- **Popular Services**: Analytics on most booked services

### Business Logic
- **2-hour buffer**: Automatically enforced between appointments
- **Business hours**: Configurable per day of the week
- **Availability**: Real-time slot availability checking
- **Validation**: Email, phone, and form validation

## Customization

### Adding New Services
Edit `src/data/services.json` to add new services:

```json
{
  "id": "new-service",
  "name": "New Service",
  "description": "Description of the new service",
  "duration": 90,
  "price": 120,
  "category": "hair",
  "image": "/images/services/new-service.jpg"
}
```

### Changing Business Hours
Update the `businessHours` section in `services.json`:

```json
"businessHours": {
  "monday": { "open": "09:00", "close": "18:00", "closed": false }
}
```

### Styling
- Colors: Edit Tailwind classes (rose-* colors)
- Layout: Modify component JSX
- Typography: Update font imports in `layout.tsx`

## Migration to Backend

The current implementation uses localStorage for data persistence. To migrate to a backend:

1. **Database Setup**: Use PostgreSQL, MongoDB, or your preferred database
2. **API Implementation**: Replace localStorage calls with database operations
3. **Authentication**: Add user authentication for admin dashboard
4. **Email/SMS**: Implement notification services
5. **Payment Processing**: Add Stripe or similar payment integration

### Ready-to-migrate Data Structure
All data is already structured in TypeScript interfaces, making backend migration straightforward.

## Future Enhancements

### Planned Features
- [ ] Email notifications (confirmation, reminders)
- [ ] SMS notifications via Twilio
- [ ] Payment processing integration
- [ ] Customer portal for booking management
- [ ] Staff management system
- [ ] Inventory management
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Loyalty program

### Technical Improvements
- [ ] Database integration
- [ ] User authentication
- [ ] API rate limiting
- [ ] Image upload for services
- [ ] Advanced caching
- [ ] Performance monitoring
- [ ] Automated testing suite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@omakhair.com or create an issue in the repository.

---

**Built with ❤️ for Oma Khair**