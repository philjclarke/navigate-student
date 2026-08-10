import { User, Puzzle, Trash2, Plus, CheckCircle2 } from 'lucide-react'
import { Card, Button, HoursCard, FauxSelect, Field } from '../components/ui'

const SKILLS_FOCUS = ['Building Relationships', 'Collaboration', 'Communication', 'Customer Service', 'Enterprising', 'Physical Health']

export default function Profile() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 rounded-2xl bg-gradient-to-r from-brand-100 to-purple-50 p-6 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-brand-600">
              <User size={16} /> Profile
            </p>
            <h1 className="mt-2 text-3xl font-light text-gray-600">My Profile</h1>
            <p className="mt-4 text-2xl font-light text-gray-600">Welcome Back, Jason</p>
            <p className="text-sm text-gray-500">Last login: 30/07/2026</p>
            <Button variant="dark" className="mt-3 !bg-brand-700">Preview CV</Button>
          </div>
          <Card className="mt-auto">
            <p className="text-sm text-gray-500">Your next destination:</p>
            <p className="mt-1 text-lg font-semibold text-purple-700">University (EDU-6)</p>
            <p className="text-sm text-purple-600">Archaeology</p>
          </Card>
        </div>
        <div>
          <h2 className="mb-3 text-2xl font-light text-gray-600">Your Activity Hours</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <HoursCard title="Employer Engagement Hours" value={0} />
            <HoursCard title="Enrichment Hours" value={5} />
            <HoursCard title="Employer Confirmed Placement Hours" value={0} />
            <HoursCard title="Student Confirmed Placement Hours" value={0} />
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-2xl font-light text-gray-600">Your Details</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Title:" defaultValue="Mr" />
              <Field label="Forename:" required defaultValue="Jason" />
              <Field label="Surname:" required defaultValue="Gould" />
            </div>
            <div className="mt-4"><Field label="Username:" required defaultValue="Jason Gould" /></div>
          </section>

          <section>
            <h2 className="mb-1 text-xl font-light text-gray-600">Change your email address</h2>
            <p className="mb-3 text-sm">Current Email address: <strong>jason@education.co.uk</strong></p>
            <div className="space-y-4">
              <Field label="New email address:" required />
              <Field label="Confirm email address:" required />
              <Button><span className="flex items-center gap-2"><CheckCircle2 size={15} /> Save</span></Button>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-light text-gray-600">Change your password</h2>
            <div className="space-y-4">
              <Field label="Current password:" required type="password" />
              <Field label="New password:" required type="password" />
              <Field label="Confirm new password:" required type="password" />
              <Button><span className="flex items-center gap-2"><CheckCircle2 size={15} /> Save</span></Button>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-brand-100 p-6">
            <h2 className="text-2xl font-light text-gray-600">Your skills and career profile</h2>
            <p className="mt-2 text-sm text-gray-600">
              Use this panel to set your Next Destination and select the list of skills you would like
              to focus on developing.
            </p>
            <Card className="mt-4">
              <p className="font-bold">Your next destination</p>
              <p className="mt-1 text-sm text-gray-500">Where are you aiming for? Select what you want your next step to be:</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <FauxSelect value="University (EDU-6)" />
                <FauxSelect value="Archaeology" />
              </div>
              <Button className="mt-4"><span className="flex items-center gap-2"><CheckCircle2 size={15} /> Update</span></Button>
            </Card>
          </div>

          <Card>
            <p className="text-xl font-light text-gray-600">Your skills focus</p>
            <p className="mt-1 text-sm text-gray-500">What skills are you looking to develop?</p>
            <div className="mt-3 flex gap-3">
              <FauxSelect className="flex-1" />
              <Button small><span className="flex items-center gap-1.5"><Plus size={14} /> Add</span></Button>
            </div>
            <ul className="mt-3 divide-y divide-gray-100">
              {SKILLS_FOCUS.map((s) => (
                <li key={s} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="flex items-center gap-2">
                    <Puzzle size={15} className="text-brand-500" /> {s}
                  </span>
                  <button className="text-red-500 hover:text-red-600" aria-label={`Remove ${s}`}>
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
