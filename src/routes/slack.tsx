import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { useMutation, useAction } from 'convex/react'
import { useState } from 'react'

export const Route = createFileRoute('/slack')({
  component: SlackManagement,
})

function SlackManagement() {
  const [channelId, setChannelId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [pairingInterval, setPairingInterval] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly')
  const [excludeDays, setExcludeDays] = useState(14)

  const { data: slackUsers } = useSuspenseQuery(
    convexQuery(api.slack.getActiveSlackUsers, {})
  )

  const { data: availableUsers } = useSuspenseQuery(
    convexQuery(api.config.getAvailableUsers, {})
  )

  const { data: botConfig } = useSuspenseQuery(
    convexQuery(api.config.getAllBotConfig, {})
  )

  const syncUsers = useAction(api.slackActions.syncSlackUsers)
  const createPairings = useAction(api.pairing.createRandomPairings)
  const sendMessages = useAction(api.pairing.sendPairingMessages)
  const setBotConfig = useMutation(api.config.setBotConfig)
  const updateUserPrefs = useMutation(api.config.updateUserPreferences)

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
      const result = await createPairings({ excludeRecentDays: excludeDays })
      setResult(`✅ Created ${result.pairCount} pairings (${result.unpairedCount} unpaired)`)
    } catch (error) {
      setResult(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      await setBotConfig({
        key: 'pairingInterval',
        value: pairingInterval,
        description: 'How often to create pairings'
      })
      await setBotConfig({
        key: 'excludeRecentDays',
        value: excludeDays,
        description: 'Days to exclude recent pairings'
      })
      setResult('✅ Configuration saved!')
    } catch (error) {
      setResult(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserOptOut = async (slackId: string, optOut: boolean) => {
    try {
      await updateUserPrefs({ slackId, isOptedOut: optOut })
      setResult(optOut ? '✅ User opted out' : '✅ User opted back in')
    } catch (error) {
      setResult(`❌ Error: ${error.message}`)
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
        {/* Bot Configuration */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">⚙️ Bot Configuration</h2>
            <p className="text-sm text-base-content/70 mb-4">
              Configure pairing frequency and behavior.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Pairing Interval</span>
                </label>
                <select
                  className="select select-bordered"
                  value={pairingInterval}
                  onChange={(e) => setPairingInterval(e.target.value as any)}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Exclude Recent Days</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={excludeDays}
                  onChange={(e) => setExcludeDays(Number(e.target.value))}
                  min="7"
                  max="90"
                />
                <label className="label">
                  <span className="label-text-alt">Avoid pairing people who were matched this recently</span>
                </label>
              </div>
            </div>

            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={handleSaveConfig}
                disabled={isLoading}
              >
                {isLoading ? <span className="loading loading-spinner"></span> : '💾'}
                Save Configuration
              </button>
            </div>
          </div>
        </div>

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
                <h3 className="font-semibold mb-2">All Users ({slackUsers.length})</h3>
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

        {/* User Status & Preferences */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">👤 User Status & Preferences</h2>
            <p className="text-sm text-base-content/70 mb-4">
              View and manage user availability for coffee chat pairings.
            </p>

            <div className="stats stats-horizontal shadow mb-4">
              <div className="stat">
                <div className="stat-title">Total Users</div>
                <div className="stat-value text-primary">{slackUsers.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Available</div>
                <div className="stat-value text-success">{availableUsers.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Opted Out/Snoozed</div>
                <div className="stat-value text-warning">{slackUsers.length - availableUsers.length}</div>
              </div>
            </div>

            {slackUsers.length > 0 && (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Last Paired</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slackUsers.map((user) => {
                      const isAvailable = availableUsers.some(u => u._id === user._id);
                      const isOptedOut = user.isOptedOut;
                      const isSnoozed = user.snoozeUntil && user.snoozeUntil > Date.now();
                      
                      let statusBadge = <div className="badge badge-success">Available</div>;
                      if (isOptedOut) {
                        statusBadge = <div className="badge badge-error">Opted Out</div>;
                      } else if (isSnoozed) {
                        statusBadge = <div className="badge badge-warning">Snoozed</div>;
                      }

                      return (
                        <tr key={user._id}>
                          <td className="font-medium">{user.name}</td>
                          <td>{statusBadge}</td>
                          <td>
                            {user.lastPairedAt 
                              ? new Date(user.lastPairedAt).toLocaleDateString()
                              : 'Never'
                            }
                          </td>
                          <td>
                            <div className="flex gap-2">
                              {isOptedOut ? (
                                <button
                                  className="btn btn-xs btn-success"
                                  onClick={() => handleUserOptOut(user.slackId, false)}
                                >
                                  Opt In
                                </button>
                              ) : (
                                <button
                                  className="btn btn-xs btn-warning"
                                  onClick={() => handleUserOptOut(user.slackId, true)}
                                >
                                  Opt Out
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                disabled={isLoading || availableUsers.length < 2}
              >
                {isLoading ? <span className="loading loading-spinner"></span> : '🚀'}
                Run Complete Pairing Process
              </button>
            </div>

            {availableUsers.length < 2 && (
              <div className="alert alert-warning mt-4">
                <span>Need at least 2 available users to create pairings. {availableUsers.length}/2 currently available.</span>
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
                    <li>Add these Bot Token Scopes: <code>users:read</code>, <code>chat:write</code>, <code>channels:read</code>, <code>im:write</code>, <code>commands</code></li>
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
                  <strong>Set Up Slash Commands (Optional):</strong>
                  <ul>
                    <li>Go to "Slash Commands" in your app settings</li>
                    <li>Create command: <code>/coffee</code></li>
                    <li>Request URL: <code>https://your-convex-app.convex.cloud/coffee</code></li>
                    <li>Description: "Manage coffee chat preferences"</li>
                  </ul>
                </li>
                <li>
                  <strong>Automation:</strong>
                  <ul>
                    <li>Configure pairing interval above (weekly, bi-weekly, monthly)</li>
                    <li>Users can opt-out or snooze using buttons in pairing messages</li>
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