// pages/test.tsx
import { useAuth } from '../supa_database/auth'
import { useProjects } from '../supa_database/hooks/useProject'

export default function TestPage() {
  const { user, profile } = useAuth()
  const { projects, createProject } = useProjects(user?.id)

  return (
    <div>
      <p>User: {user?.email || 'Not signed in'}</p>
      <p>Projects: {projects.length}</p>
    </div>
  )
}
