import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '@/convex/_generated/api'
import { useConvexAction } from 'convex/react'
import { useState } from 'react'

export const Route = createFileRoute('/slack')({
  component: SlackManagement,
})

function SlackManagement() {
  const [channelId, setChannelId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const { data: slackUsers } = useSuspenseQuery(
    convexQuery(api.slack.getActiveSlackUsers, {})
  )

  const syncUsers = useConvexAction(api.slack.syncSlackUsers)
  const createPairings = useConvexAction(api.pairing.createRandomPairings)
  const sendMessages = useConvexAction(api.pairing.sendPairingMessages)

  const handleSyncUsers = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      await syncUsers({ channelId: channelId || undefined })
      setResult('✅ Users synced successfully!')
    } catch (error) {
      setResult(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePairings = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      const result = await createPairings({ excludeRecentDays: 14 })
      setResult(`✅ Created ${result.pairCount} pairings (${result.unpairedCount} unpaired)`)
    } catch (error) {
      setResult(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessages = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      const results = await sendMessages({})
      const success = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length
      setResult(`✅ Sent ${success} messages, ${failed} failed`)
    } catch (error) {
      setResult(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRunFullProcess = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      // Create pairings
      const pairingResult = await createPairings({ excludeRecentDays: 14 })
      
      // Send messages
      const messageResults = await sendMessages({ pairingIds: pairingResult.pairingIds })
      const success = messageResults.filter(r => r.success).length
      const failed = messageResults.filter(r => !r.success).length
      
      setResult(`✅ Complete! Created ${pairingResult.pairCount} pairings, sent ${success} messages, ${failed} failed`)
    } catch (error) {
      setResult(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Slack Coffee Chat Bot</h1>
        <p className="text-base-content/70">
          Manage your Slack coffee chat pairings. Set up your Slack app credentials in the Convex dashboard first.
        </p>
      </div>

      <div className="grid gap-6">
        {/* User Management */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">👥 User Management</h2>
            <p className="text-sm text-base-content/70 mb-4">
              Sync users from your Slack workspace or a specific channel.
            </p>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Channel ID (optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., C1234567890 (leave empty for all workspace users)"
                className="input input-bordered"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
              />
              <label className="label">
                <span className="label-text-alt">Find channel ID in Slack: right-click channel → Copy link → ID is at the end</span>
              </label>
            </div>

            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={handleSyncUsers}
                disabled={isLoading}
              >
                {isLoading ? <span className="loading loading-spinner"></span> : '🔄'}
                Sync Users
              </button>
            </div>

            {slackUsers.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Active Users ({slackUsers.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {slackUsers.slice(0, 12).map((user) => (
                    <div key={user._id} className="badge badge-ghost p-3">
                      {user.name}
                    </div>
                  ))}
                  {slackUsers.length > 12 && (
                    <div className="badge badge-outline p-3">
                      +{slackUsers.length - 12} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pairing Management */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🤝 Pairing Management</h2>
            <p className="text-sm text-base-content/70 mb-4">
              Create random pairings and send coffee chat invitations.
            </p>

            <div className="grid gap-3">
              <button
                className="btn btn-outline"
                onClick={handleCreatePairings}
                disabled={isLoading || slackUsers.length < 2}
              >
                {isLoading ? <span className="loading loading-spinner"></span> : '🎲'}
                Create Random Pairings
              </button>

              <button
                className="btn btn-outline"
                onClick={handleSendMessages}
                disabled={isLoading}
              >
                {isLoading ? <span className="loading loading-spinner"></span> : '💬'}
                Send Pairing Messages
              </button>

              <div className="divider">OR</div>

              <button
                className="btn btn-success"
                onClick={handleRunFullProcess}
                disabled={isLoading || slackUsers.length < 2}
              >
                {isLoading ? <span className="loading loading-spinner"></span> : '🚀'}
                Run Complete Pairing Process
              </button>
            </div>

            {slackUsers.length < 2 && (
              <div className="alert alert-warning mt-4">
                <span>Need at least 2 active users to create pairings. Sync users first.</span>
              </div>
            )}
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">⚙️ Setup Instructions</h2>
            <div className="prose prose-sm max-w-none">
              <ol>
                <li>
                  <strong>Create a Slack App:</strong>
                  <ul>
                    <li>Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="link">api.slack.com/apps</a></li>
                    <li>Click "Create New App" → "From scratch"</li>
                    <li>Name it "Coffee Chat Bot" and select your workspace</li>
                  </ul>
                </li>
                <li>
                  <strong>Set Bot Permissions:</strong>
                  <ul>
                    <li>Go to "OAuth & Permissions" in your app settings</li>
                    <li>Add these Bot Token Scopes: <code>users:read</code>, <code>chat:write</code>, <code>channels:read</code>, <code>im:write</code></li>
                    <li>Install the app to your workspace</li>
                    <li>Copy the "Bot User OAuth Token" (starts with xoxb-)</li>
                  </ul>
                </li>
                <li>
                  <strong>Configure Convex:</strong>
                  <ul>
                    <li>In your Convex dashboard, go to Settings → Environment Variables</li>
                    <li>Add <code>SLACK_BOT_TOKEN</code> with your bot token</li>
                    <li>Optionally add <code>SLACK_SIGNING_SECRET</code> from "Basic Information" in your Slack app</li>
                  </ul>
                </li>
                <li>
                  <strong>Weekly Automation:</strong>
                  <ul>
                    <li>The bot will automatically run every Monday at 9 AM UTC</li>
                    <li>You can also trigger pairings manually using this interface</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`alert ${result.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
            <span>{result}</span>
          </div>
        )}
      </div>
    </div>
  )
}