'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ArrowUpIcon, ArrowDownIcon, Users, Clock, MousePointerClick, ArrowRight } from 'lucide-react'

const pageViewsData = [
  { name: 'Mon', views: 4000 },
  { name: 'Tue', views: 3000 },
  { name: 'Wed', views: 5000 },
  { name: 'Thu', views: 4500 },
  { name: 'Fri', views: 6000 },
  { name: 'Sat', views: 3500 },
  { name: 'Sun', views: 3000 },
]

const trafficData = [
  { name: 'Organic', value: 60, color: '#3b82f6' },
  { name: 'Direct', value: 20, color: '#10b981' },
  { name: 'Referral', value: 15, color: '#f59e0b' },
  { name: 'Social', value: 5, color: '#ef4444' },
]

const bounceRateData = [
  { name: 'Week 1', rate: 45 },
  { name: 'Week 2', rate: 42 },
  { name: 'Week 3', rate: 40 },
  { name: 'Week 4', rate: 38 },
]

export default function Analytics() {
  const [currentDate, setCurrentDate] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setCurrentDate(new Date().toLocaleString())
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="flex items-center justify-between h-16 px-4 bg-white border-b shrink-0 md:px-6">
        <h1 className="text-lg font-semibold">Analytics Dashboard</h1>
        <span className="text-sm text-gray-500">Last updated: {currentDate}</span>
      </header>
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Total Visitors', value: '45,231', change: '+5.2%', icon: Users },
            { title: 'Avg. Session Duration', value: '3m 42s', change: '-1.1%', icon: Clock },
            { title: 'Bounce Rate', value: '38%', change: '+2.3%', icon: MousePointerClick },
            { title: 'Conversion Rate', value: '3.8%', change: '+0.5%', icon: ArrowRight },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium text-gray-500">{item.title}</h2>
                <item.icon className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-gray-500">
                <span className={`inline-flex items-center ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change.startsWith('+') ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
                  {item.change}
                </span>{' '}
                vs last month
              </p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b">
            {['overview', 'traffic-sources'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="p-4">
            {activeTab === 'overview' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Page Views</h2>
                  <p className="text-sm text-gray-500 mb-4">Daily page views for the last week</p>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pageViewsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="views" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Bounce Rate Trend</h2>
                  <p className="text-sm text-gray-500 mb-4">Weekly bounce rate over the last month</p>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bounceRateData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="rate" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Traffic Sources</h2>
                  <p className="text-sm text-gray-500 mb-4">Breakdown of traffic sources</p>
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="w-full md:w-1/2 h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={trafficData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {trafficData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                      {trafficData.map((item) => (
                        <div key={item.name} className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                            <div className="text-sm font-medium">{item.name}</div>
                          </div>
                          <div className="text-2xl font-semibold">{item.value}%</div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${item.value}%`, backgroundColor: item.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Top Referrers</h2>
                  <p className="text-sm text-gray-500 mb-4">Websites sending the most traffic</p>
                  <div className="space-y-4">
                    {[
                      { name: 'google.com', visits: 12500 },
                      { name: 'facebook.com', visits: 8700 },
                      { name: 'twitter.com', visits: 6200 },
                      { name: 'linkedin.com', visits: 4800 },
                      { name: 'youtube.com', visits: 3500 },
                    ].map((referrer, index) => (
                      <div key={referrer.name} className="flex items-center">
                        <div className="w-8 text-gray-500">{index + 1}.</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{referrer.name}</div>
                          <div className="text-xs text-gray-500">{referrer.visits.toLocaleString()} visits</div>
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${(referrer.visits / 12500) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}