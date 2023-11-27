export interface AsyncPoolOptions {
  concurrentCount?: number
  retryCount?: number
}

type Callback = (...args: any) => any

interface Task {
  status: 'executing' | 'pending' | 'success' | 'done'
  retriedCount: number
  task: Callback
}

// {
//   concurrentCount,
//     retryCount
// }: AsyncPoolOptions = {}
export class AsyncPool {
  taskQueue: Task[]
  // 当前执行的数量
  _executingCount: number = 0
  onSuccessCb: (v?: any) => void = () => {}
  onErrorCb: (reason?: any) => void = () => {}
  // 一个标识用于来处理 reset后，已经在异步请求的接口会触发回调
  _flag: number = 0

  constructor(
    public concurrentCount: number = 4,
    public retryCount: number = 0,
  ) {
    this.concurrentCount = concurrentCount
    this.retryCount = retryCount
    this.taskQueue = []
  }

  async _run(task: Task) {
    console.log('run---')
    const currentFlag = this._flag
    // 触发执行
    ++this._executingCount
    try {
      await task.task()
    } catch (error) {
      console.log('error', error)
      if (this._flag === currentFlag) {
        if (task.retriedCount < this.retryCount) {
          task.retriedCount += 1
          this.taskQueue.push(task)
        } else {
          this.onErrorCb(error)
        }
      }
    } finally {
      if (this._flag === currentFlag) {
        --this._executingCount
        this.scheduleTask()
        if (this._executingCount === 0 && this.taskQueue.length === 0) {
          console.log('run????')
          this.onSuccessCb()
        }
      }
    }
  }

  generateTask(fn: Callback) {
    const task: Task = {
      task: fn,
      status: 'pending',
      retriedCount: 0,
    }
    return task
  }

  scheduleTask() {
    if (this._executingCount < this.concurrentCount && this.taskQueue.length) {
      const task = this.taskQueue.shift()
      this._run(task!)
    }
  }

  callAuto(fn: Callback) {
    const task = this.generateTask(fn)
    this.taskQueue.push(task)
    // 开启调度
    this.scheduleTask()
  }

  callManual(fn: Callback) {
    const task = this.generateTask(fn)
    this.taskQueue.push(task)
  }

  onSuccess(fn: (v?: any) => void) {
    console.log('en????')
    this.onSuccessCb = fn
  }

  onError(fn: (reson?: any) => void) {
    this.onErrorCb = fn
  }

  runAsync() {
    this.scheduleTask()
  }

  // 暂停
  pause() {}

  reStart() {}

  reset() {
    ++this._flag
  }
}
