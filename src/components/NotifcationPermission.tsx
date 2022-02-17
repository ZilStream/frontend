import React from "react"

const NotificationPermission = () => {

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission()
      console.log(result)
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <>
      {Notification.permission === "default" &&
        <div className="bg-gray-200 dark:bg-gray-800 py-3 px-4 rounded-lg inline-block">
          <h3 className="text-lg font-semibold">Please enable notifications</h3>
          <p>In order for alerts to function you need to enable notifications for ZilStream in your browser.</p>
          <button 
            onClick={() => requestPermission()}
            className="bg-gray-300 dark:bg-gray-700 rounded py-1 px-3 font-medium mt-2"
          >
            Give Access
          </button>
        </div>
      }

      {Notification.permission === "denied" &&
        <div className="bg-gray-200 dark:bg-gray-800 py-3 px-4 rounded-lg inline-block">
          <h3 className="text-lg font-semibold">Please enable notifications</h3>
          <p>It looks like you've previously denied ZilStream notifications :( Please enable them to make use of this functionality.</p>
        </div>
      }
    </>
  )
}

export default NotificationPermission