/**
 * Fitness Plan — a weekly workout plan with per-set check-off and a daily
 * reminder. The Host half is intentionally empty: the plan and its check-ins
 * are user-owned local data, kept in this browser's localStorage so the plugin
 * works without a Session, a model call, or a network connection.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-fitness-plan',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useCallback, useEffect, useState, useSyncExternalStore } = React

    const NS = 'fitness-plan'
    const PANEL_ID = 'fitness'
    const STORAGE_KEY = 'dsh-fitness-plan.v1'
    const WEEKDAY_KEYS = ['weekday0', 'weekday1', 'weekday2', 'weekday3', 'weekday4', 'weekday5', 'weekday6']

    const ZH = {
      panel: '健身训练',
      pageEyebrow: '训练计划 · 按周循环',
      pageTitle: '今天练什么？',
      pageSubtitle: '预设每周计划，练完一组就勾掉一格。',
      tabToday: '今天',
      tabPlan: '训练计划',
      tabRecords: '训练记录',
      todayLabel: '今日训练',
      restDay: '休息日',
      exercisesUnit: '个动作',
      setsUnit: '组',
      totalSetsPrefix: '共',
      completed: '已完成',
      allDone: '今天的训练全部完成，干得漂亮。',
      checkHint: '每完成一组，点一下对应的方格；再点一次可取消。',
      todayExercises: '今日动作',
      todaySets: '今日组数',
      todayAdjusted: '已临时调整',
      addSet: '加一组',
      removeSet: '减一组',
      resetPreset: '恢复预设',
      presetLabel: '预设',
      todayOnly: '仅今天生效',
      adjustHint: '今天临时加减组，不会改动每周预设。',
      clearToday: '清空今日',
      clearConfirm: '清空今天所有已勾选的组？',
      reminderAt: '每日提醒时间',
      reminderOff: '每日提醒已关闭',
      edit: '修改',
      weekOverview: '本周概览',
      weekRest: '休',
      nextTraining: '下一次训练',
      restTitle: '今天是休息日',
      restBody: '恢复也是训练的一部分。吃好、睡好，下一次继续。',
      restMeta: '今天不安排训练。',
      editToday: '调整今日计划',
      noNextTraining: '本周没有安排训练。',
      planHeading: '每周计划',
      planHint: '周一至周日固定循环；今天临时加减组不会改动这里。',
      dayName: '训练日名称',
      dayNamePlaceholder: '例如：胸腿日',
      restEditorTitle: '这一天是休息日',
      restEditorBody: '添加动作后会自动变成训练日。',
      addFirstExercise: '添加第一个动作',
      addExercise: '添加动作',
      exerciseName: '动作名称',
      setsLabel: '组数',
      repsLabel: '次数 / 时长',
      exerciseNamePlaceholder: '例如：深蹲',
      repsPlaceholder: '例如：10 或 30 秒',
      savePlan: '保存计划',
      saved: '计划已保存',
      unsaved: '有未保存的修改',
      discard: '放弃修改',
      discardConfirm: '放弃未保存的计划修改？',
      resetDefault: '恢复默认计划',
      resetConfirm: '恢复默认计划？当前编辑的内容会被替换，保存后生效。',
      resetLoaded: '已载入默认计划，点击保存后生效。',
      confirm: '确定',
      cancel: '取消',
      errorName: '动作名称不能为空。',
      errorReps: '次数 / 时长不能为空。',
      errorGeneric: '请检查动作名称和次数后再保存。',
      deleteExercise: '删除动作',
      reminderTitle: '每日提醒',
      reminderBody: '到了设定时间，如果今天还没练完，会在页面右下角提醒你。页面打开时才生效。',
      reminderTime: '提醒时间',
      browserNotify: '桌面通知',
      browserNotifyHint: '允许后，页面在后台时也会弹出系统通知。',
      notifyOn: '已开启',
      notifyEnable: '开启桌面通知',
      notifyDenied: '浏览器已阻止通知，请在浏览器或系统设置中恢复；页面内提醒仍会生效。',
      notifyUnsupported: '当前环境不支持桌面通知。',
      notifyTest: '发送测试',
      notifyTestTitle: '健身训练计划',
      notifyTestBody: '桌面通知已开启，训练日到点会提醒你。',
      reminderSwitch: '每日提醒开关',
      recordsTitle: '最近 14 天',
      recordsHint: '勾选记录只保存在这台设备的浏览器里。',
      statDoneDays: '本周完成',
      statPlannedDays: '本周安排',
      statSets: '本周完成组数',
      recordRest: '休息日',
      recordNoRecord: '未记录',
      recordComplete: '已完成',
      recordPartial: '进行中',
      recordToday: '今天',
      remainingSets: '还剩',
      dockTitle: '今天该训练了',
      goTrain: '去训练',
      dismissToday: '今天不再提醒',
      notifyTitle: '今天该训练了',
      close: '关闭',
      setLabel: '第',
      setSuffix: '组',
      done: '已完成',
      notDone: '未完成',
      localOnly: '计划与记录保存在本机浏览器中。',
      weekPlanNote: '预设每周循环；今天临时加减组只影响当天。',
      noExercises: '暂无动作',
      addToDay: '添加动作',
      summaryDone: '完成',
      summaryPlanned: '计划',
    }

    const EN = {
      panel: 'Fitness Plan',
      pageEyebrow: 'WEEKLY TRAINING PLAN',
      pageTitle: 'What are we training today?',
      pageSubtitle: 'Preset your week and tick off each set as you finish it.',
      tabToday: 'Today',
      tabPlan: 'Plan',
      tabRecords: 'History',
      todayLabel: 'Today',
      restDay: 'Rest day',
      exercisesUnit: 'exercises',
      setsUnit: 'sets',
      totalSetsPrefix: 'total',
      completed: 'Completed',
      allDone: 'All of today’s sets are done. Nice work.',
      checkHint: 'Tap a square after each set. Tap again to undo.',
      todayExercises: 'Today’s exercises',
      todaySets: 'Sets today',
      todayAdjusted: 'Adjusted today',
      addSet: 'Add one set',
      removeSet: 'Remove one set',
      resetPreset: 'Reset to preset',
      presetLabel: 'Preset',
      todayOnly: 'Today only',
      adjustHint: 'Adjust today without changing the weekly preset.',
      clearToday: 'Clear today',
      clearConfirm: 'Clear every checked set for today?',
      reminderAt: 'Daily reminder',
      reminderOff: 'Daily reminder is off',
      edit: 'Edit',
      weekOverview: 'This week',
      weekRest: 'Rest',
      nextTraining: 'Next workout',
      restTitle: 'Today is a rest day',
      restBody: 'Recovery is part of training. Eat, sleep, and come back stronger.',
      restMeta: 'No workout scheduled today.',
      editToday: 'Edit today',
      noNextTraining: 'No workouts are scheduled this week.',
      planHeading: 'Weekly plan',
      planHint: 'The week repeats Monday to Sunday. Today’s temporary changes never edit this preset.',
      dayName: 'Day name',
      dayNamePlaceholder: 'e.g. Push day',
      restEditorTitle: 'This is a rest day',
      restEditorBody: 'Add an exercise to turn it into a training day.',
      addFirstExercise: 'Add the first exercise',
      addExercise: 'Add exercise',
      exerciseName: 'Exercise',
      setsLabel: 'Sets',
      repsLabel: 'Reps / duration',
      exerciseNamePlaceholder: 'e.g. Back squat',
      repsPlaceholder: 'e.g. 10 or 30 sec',
      savePlan: 'Save plan',
      saved: 'Plan saved',
      unsaved: 'Unsaved changes',
      discard: 'Discard',
      discardConfirm: 'Discard the unsaved plan changes?',
      resetDefault: 'Restore default plan',
      resetConfirm: 'Restore the default plan? Your current edits will be replaced after you save.',
      resetLoaded: 'Default plan loaded. Save to apply it.',
      confirm: 'Confirm',
      cancel: 'Cancel',
      errorName: 'Exercise names cannot be empty.',
      errorReps: 'Reps or duration cannot be empty.',
      errorGeneric: 'Check the exercise names and reps before saving.',
      deleteExercise: 'Delete exercise',
      reminderTitle: 'Daily reminder',
      reminderBody: 'If today’s workout is unfinished at the set time, a reminder appears at the bottom-right while the page is open.',
      reminderTime: 'Time',
      browserNotify: 'Desktop notification',
      browserNotifyHint: 'Allow it to receive a system notification while this page is in the background.',
      notifyOn: 'On',
      notifyEnable: 'Enable desktop notifications',
      notifyDenied: 'Notifications are blocked. Restore them in the browser or system settings; the in-page reminder still works.',
      notifyUnsupported: 'Desktop notifications are not supported here.',
      notifyTest: 'Send test',
      notifyTestTitle: 'Fitness Plan',
      notifyTestBody: 'Desktop notifications are on. You will be reminded on training days.',
      reminderSwitch: 'Daily reminder switch',
      recordsTitle: 'Last 14 days',
      recordsHint: 'Check-ins are stored only in this browser on this device.',
      statDoneDays: 'Done this week',
      statPlannedDays: 'Planned this week',
      statSets: 'Sets this week',
      recordRest: 'Rest day',
      recordNoRecord: 'No record',
      recordComplete: 'Complete',
      recordPartial: 'In progress',
      recordToday: 'Today',
      remainingSets: 'remaining:',
      dockTitle: 'Time to train',
      goTrain: 'Open plan',
      dismissToday: 'Not today',
      notifyTitle: 'Time to train',
      close: 'Close',
      setLabel: 'Set',
      setSuffix: '',
      done: 'done',
      notDone: 'not done',
      localOnly: 'Your plan and check-ins are stored in this browser.',
      weekPlanNote: 'The preset repeats weekly; temporary changes apply to today only.',
      noExercises: 'No exercises yet',
      addToDay: 'Add exercise',
      summaryDone: 'Done',
      summaryPlanned: 'Planned',
    }

    const DEFAULT_DAYS = [
      {
        title: '胸腿日',
        exercises: [
          { id: 'mon-squat', name: '深蹲', sets: 4, reps: '10' },
          { id: 'mon-bench', name: '卧推', sets: 4, reps: '8' },
        ],
      },
      { title: '休息日', exercises: [] },
      {
        title: '拉日',
        exercises: [
          { id: 'wed-deadlift', name: '硬拉', sets: 4, reps: '6' },
          { id: 'wed-pullup', name: '引体向上', sets: 3, reps: '8' },
          { id: 'wed-press', name: '站姿推举', sets: 3, reps: '10' },
        ],
      },
      { title: '休息日', exercises: [] },
      {
        title: '全身日',
        exercises: [
          { id: 'fri-bench', name: '卧推', sets: 4, reps: '8' },
          { id: 'fri-row', name: '杠铃划船', sets: 4, reps: '10' },
          { id: 'fri-squat', name: '深蹲', sets: 3, reps: '12' },
        ],
      },
      {
        title: '有氧 + 核心',
        exercises: [
          { id: 'sat-cardio', name: '有氧', sets: 1, reps: '30 分钟' },
          { id: 'sat-plank', name: '平板支撑', sets: 3, reps: '60 秒' },
        ],
      },
      { title: '休息日', exercises: [] },
    ]

    // ---------------------------------------------------------------------
    // Small utilities
    // ---------------------------------------------------------------------

    function pad2(value) {
      return String(value).padStart(2, '0')
    }

    function dateKey(date) {
      return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate())
    }

    function parseDateKey(key) {
      const parts = String(key || '').split('-').map(Number)
      if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return new Date()
      return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0)
    }

    function mondayIndex(date) {
      return (date.getDay() + 6) % 7
    }

    function addDays(date, amount) {
      const next = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
      next.setDate(next.getDate() + amount)
      return next
    }

    function startOfWeek(date) {
      return addDays(date, -mondayIndex(date))
    }

    function localeTag(locale) {
      return String(locale || 'zh').toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US'
    }

    function formatLongDate(date, locale) {
      try {
        return new Intl.DateTimeFormat(localeTag(locale), {
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        }).format(date)
      } catch {
        return dateKey(date)
      }
    }

    function formatShortDate(date, locale) {
      try {
        return new Intl.DateTimeFormat(localeTag(locale), { month: 'numeric', day: 'numeric' }).format(date)
      } catch {
        return pad2(date.getMonth() + 1) + '/' + pad2(date.getDate())
      }
    }

    function clampSets(value) {
      const number = Number(value)
      if (!Number.isFinite(number)) return 3
      return Math.max(1, Math.min(20, Math.round(number)))
    }

    function reminderMinutes(value) {
      const match = /^(\d{1,2}):(\d{2})$/.exec(String(value || ''))
      if (!match) return 18 * 60 + 30
      const hours = Math.max(0, Math.min(23, Number(match[1])))
      const minutes = Math.max(0, Math.min(59, Number(match[2])))
      return hours * 60 + minutes
    }

    function reminderDue(value, now) {
      return now.getHours() * 60 + now.getMinutes() >= reminderMinutes(value)
    }

    function makeId(prefix) {
      return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7)
    }

    function clone(value) {
      return JSON.parse(JSON.stringify(value))
    }

    function planTotal(day) {
      if (!day || !Array.isArray(day.exercises)) return 0
      return day.exercises.reduce((total, exercise) => total + exercise.sets, 0)
    }

    function normalizeExercise(raw) {
      if (!raw || typeof raw !== 'object') return null
      const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 40) : ''
      if (!name) return null
      const reps = typeof raw.reps === 'string' && raw.reps.trim() ? raw.reps.trim().slice(0, 20) : '10'
      const rawId = typeof raw.id === 'string' ? raw.id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 60) : ''
      return {
        id: rawId || makeId('ex'),
        name,
        sets: clampSets(raw.sets),
        reps,
      }
    }

    function normalizeDay(raw) {
      if (!raw || typeof raw !== 'object') return { title: '休息日', exercises: [] }
      const rawExercises = Array.isArray(raw.exercises) ? raw.exercises : []
      const exercises = rawExercises.map(normalizeExercise).filter(Boolean)
      const title = typeof raw.title === 'string' && raw.title.trim()
        ? raw.title.trim().slice(0, 30)
        : exercises.length ? '训练日' : '休息日'
      return { title, exercises }
    }

    function normalizeCheckins(raw) {
      const out = {}
      if (!raw || typeof raw !== 'object') return out
      for (const [key, value] of Object.entries(raw)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !value || typeof value !== 'object') continue
        const exercises = {}
        const source = value.exercises && typeof value.exercises === 'object' ? value.exercises : {}
        for (const [exerciseId, flags] of Object.entries(source)) {
          if (!Array.isArray(flags)) continue
          const safe = flags.slice(0, 20).map(Boolean)
          if (safe.some(Boolean)) exercises[exerciseId] = safe
        }
        const setCounts = {}
        const rawSetCounts = value.setCounts && typeof value.setCounts === 'object' ? value.setCounts : {}
        for (const [exerciseId, count] of Object.entries(rawSetCounts)) {
          if (!Number.isInteger(count)) continue
          setCounts[exerciseId] = Math.max(1, Math.min(20, count))
        }
        const totalSets = Number.isFinite(value.totalSets) ? Math.max(0, Math.round(value.totalSets)) : 0
        const completedSets = Number.isFinite(value.completedSets) ? Math.max(0, Math.round(value.completedSets)) : 0
        out[key] = {
          dayIndex: Number.isInteger(value.dayIndex) ? Math.max(0, Math.min(6, value.dayIndex)) : mondayIndex(parseDateKey(key)),
          title: typeof value.title === 'string' ? value.title.slice(0, 30) : '',
          totalSets,
          completedSets,
          exercises,
          setCounts,
          updatedAt: Number.isFinite(value.updatedAt) ? value.updatedAt : 0,
        }
      }
      return out
    }

    function defaultState() {
      return {
        version: 1,
        days: clone(DEFAULT_DAYS),
        reminder: { enabled: true, time: '18:30' },
        checkins: {},
        notifiedDate: '',
        dismissedDate: '',
      }
    }

    function normalizeState(raw) {
      const base = defaultState()
      if (!raw || typeof raw !== 'object') return base
      const rawDays = Array.isArray(raw.days) ? raw.days : []
      const days = []
      for (let index = 0; index < 7; index += 1) {
        days.push(normalizeDay(rawDays[index]))
      }
      const rawReminder = raw.reminder && typeof raw.reminder === 'object' ? raw.reminder : {}
      const time = /^\d{1,2}:\d{2}$/.test(String(rawReminder.time || '')) ? String(rawReminder.time) : '18:30'
      return {
        version: 1,
        days,
        reminder: {
          enabled: rawReminder.enabled !== false,
          time,
        },
        checkins: normalizeCheckins(raw.checkins),
        notifiedDate: typeof raw.notifiedDate === 'string' ? raw.notifiedDate : '',
        dismissedDate: typeof raw.dismissedDate === 'string' ? raw.dismissedDate : '',
      }
    }

    function readStoredState() {
      if (typeof window === 'undefined') return defaultState()
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return defaultState()
        return normalizeState(JSON.parse(raw))
      } catch {
        return defaultState()
      }
    }

    function effectiveSetCount(checkin, exercise) {
      const override = checkin && checkin.setCounts ? checkin.setCounts[exercise.id] : undefined
      return Number.isInteger(override) ? override : exercise.sets
    }

    function checkedCount(state, date, exercise) {
      const flags = state.checkins[date] && state.checkins[date].exercises
        ? state.checkins[date].exercises[exercise.id]
        : undefined
      if (!Array.isArray(flags)) return 0
      const sets = effectiveSetCount(state.checkins[date], exercise)
      let count = 0
      for (let index = 0; index < sets; index += 1) {
        if (flags[index]) count += 1
      }
      return count
    }

    function progressFor(state, date, dayIndex) {
      const day = state.days[dayIndex]
      if (!day || !Array.isArray(day.exercises)) return { total: 0, done: 0, ratio: 0 }
      let total = 0
      let done = 0
      for (const exercise of day.exercises) {
        total += effectiveSetCount(state.checkins[date], exercise)
        done += checkedCount(state, date, exercise)
      }
      return { total, done, ratio: total > 0 ? done / total : 0 }
    }

    function nextTrainingDay(state, dayIndex) {
      for (let offset = 1; offset <= 7; offset += 1) {
        const index = (dayIndex + offset) % 7
        if (state.days[index] && state.days[index].exercises.length > 0) {
          return { dayIndex: index, offset, day: state.days[index] }
        }
      }
      return null
    }

    function buildCheckin(date, day, exercises, setCounts) {
      const dayIndex = mondayIndex(parseDateKey(date))
      const normalizedExercises = {}
      const normalizedCounts = {}
      let totalSets = 0
      let completedSets = 0
      for (const exercise of day.exercises) {
        const override = setCounts && setCounts[exercise.id]
        const sets = Number.isInteger(override) ? override : exercise.sets
        if (Number.isInteger(override) && override !== exercise.sets) normalizedCounts[exercise.id] = override
        totalSets += sets
        const previous = exercises ? exercises[exercise.id] : undefined
        if (!Array.isArray(previous)) continue
        const flags = Array.from({ length: sets }, (_, index) => Boolean(previous[index]))
        const done = flags.filter(Boolean).length
        if (done > 0) {
          normalizedExercises[exercise.id] = flags
          completedSets += done
        }
      }
      return {
        dayIndex,
        title: day.title,
        totalSets,
        completedSets,
        exercises: normalizedExercises,
        setCounts: normalizedCounts,
        updatedAt: Date.now(),
      }
    }

    function createStore() {
      let state = readStoredState()
      const listeners = new Set()

      function persist() {
        if (typeof window === 'undefined') return
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        } catch {
          // The UI still works for this session when storage is unavailable.
        }
      }

      function emit() {
        for (const listener of listeners) listener()
      }

      function update(producer) {
        const next = producer(state)
        if (!next || next === state) return state
        state = next
        persist()
        emit()
        return state
      }

      function applySetExerciseCount(date, exerciseId, target) {
        return update((previous) => {
          const dayIndex = mondayIndex(parseDateKey(date))
          const day = previous.days[dayIndex]
          if (!day) return previous
          const exercise = day.exercises.find((item) => item.id === exerciseId)
          if (!exercise) return previous
          const previousCheckin = previous.checkins[date]
          const current = effectiveSetCount(previousCheckin, exercise)
          const next = clampSets(target)
          const hadOverride = Boolean(previousCheckin && previousCheckin.setCounts
            && Number.isInteger(previousCheckin.setCounts[exerciseId]))
          if (next === current && (!hadOverride || next !== exercise.sets)) return previous
          const setCounts = Object.assign({}, previousCheckin ? previousCheckin.setCounts : {})
          setCounts[exerciseId] = next
          const exercises = Object.assign({}, previousCheckin ? previousCheckin.exercises : {})
          return Object.assign({}, previous, {
            checkins: Object.assign({}, previous.checkins, {
              [date]: buildCheckin(date, day, exercises, setCounts),
            }),
          })
        })
      }

      function changeSetCount(date, exerciseId, delta) {
        const dayIndex = mondayIndex(parseDateKey(date))
        const day = state.days[dayIndex]
        if (!day) return state
        const exercise = day.exercises.find((item) => item.id === exerciseId)
        if (!exercise) return state
        return applySetExerciseCount(
          date,
          exerciseId,
          effectiveSetCount(state.checkins[date], exercise) + Number(delta),
        )
      }

      return {
        subscribe(listener) {
          listeners.add(listener)
          return () => { listeners.delete(listener) }
        },
        getSnapshot() {
          return state
        },
        toggleSet(date, exerciseId, setIndex) {
          return update((previous) => {
            const dayIndex = mondayIndex(parseDateKey(date))
            const day = previous.days[dayIndex]
            if (!day) return previous
            const exercise = day.exercises.find((item) => item.id === exerciseId)
            if (!exercise) return previous
            const previousCheckin = previous.checkins[date]
            const sets = effectiveSetCount(previousCheckin, exercise)
            if (setIndex < 0 || setIndex >= sets) return previous
            const flags = Array.from({ length: sets }, (_, index) => {
              return Boolean(previousCheckin && previousCheckin.exercises && previousCheckin.exercises[exerciseId]
                ? previousCheckin.exercises[exerciseId][index]
                : false)
            })
            flags[setIndex] = !flags[setIndex]
            const exercises = Object.assign({}, previousCheckin ? previousCheckin.exercises : {})
            if (flags.some(Boolean)) exercises[exerciseId] = flags
            else delete exercises[exerciseId]
            return Object.assign({}, previous, {
              checkins: Object.assign({}, previous.checkins, {
                [date]: buildCheckin(date, day, exercises, previousCheckin ? previousCheckin.setCounts : undefined),
              }),
            })
          })
        },
        adjustSets(date, exerciseId, delta) {
          return changeSetCount(date, exerciseId, delta)
        },
        setExerciseSets(date, exerciseId, nextSets) {
          return applySetExerciseCount(date, exerciseId, nextSets)
        },
        clearDate(date) {
          return update((previous) => {
            if (!previous.checkins[date]) return previous
            const checkins = Object.assign({}, previous.checkins)
            delete checkins[date]
            return Object.assign({}, previous, { checkins })
          })
        },
        savePlan(days) {
          return update((previous) => Object.assign({}, previous, {
            days: days.map(normalizeDay).slice(0, 7),
          }))
        },
        setReminder(patch) {
          return update((previous) => {
            const reminder = Object.assign({}, previous.reminder, patch)
            const resetNotification = Object.prototype.hasOwnProperty.call(patch, 'time')
              || (patch.enabled === true && previous.reminder.enabled !== true)
            return Object.assign({}, previous, {
              reminder,
              notifiedDate: resetNotification ? '' : previous.notifiedDate,
              dismissedDate: resetNotification ? '' : previous.dismissedDate,
            })
          })
        },
        markNotified(date) {
          return update((previous) => {
            if (previous.notifiedDate === date) return previous
            return Object.assign({}, previous, { notifiedDate: date })
          })
        },
        dismissFor(date) {
          return update((previous) => {
            if (previous.dismissedDate === date) return previous
            return Object.assign({}, previous, { dismissedDate: date })
          })
        },
      }
    }

    // ---------------------------------------------------------------------
    // Icons (all original artwork; sidebar inherits the host's currentColor)
    // ---------------------------------------------------------------------

    function SvgIcon({ size = 18, children, strokeWidth = 1.8, viewBox = '0 0 24 24' }) {
      return h('svg', {
        viewBox,
        width: size,
        height: size,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        focusable: 'false',
      }, children)
    }

    function DumbbellGlyph({ size = 18 }) {
      return h(SvgIcon, { size },
        h('path', { d: 'M6.5 8.5v7M3.5 10v4M17.5 8.5v7M20.5 10v4M6.5 12h11' }),
        h('path', { d: 'M4.5 8.5v7M19.5 8.5v7' }))
    }

    function CheckGlyph({ size = 16 }) {
      return h(SvgIcon, { size, strokeWidth: 2.2 }, h('path', { d: 'm4.5 12.5 4.5 4.5L19.5 6.5' }))
    }

    function BellGlyph({ size = 18 }) {
      return h(SvgIcon, { size },
        h('path', { d: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9' }),
        h('path', { d: 'M10 21h4' }))
    }

    function MoonGlyph({ size = 24 }) {
      return h(SvgIcon, { size },
        h('path', { d: 'M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z' }))
    }

    function CalendarGlyph({ size = 16 }) {
      return h(SvgIcon, { size },
        h('rect', { x: 3, y: 5, width: 18, height: 16, rx: 2 }),
        h('path', { d: 'M16 3v4M8 3v4M3 10h18' }))
    }

    function TrashGlyph({ size = 16 }) {
      return h(SvgIcon, { size },
        h('path', { d: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3' }))
    }

    function PlusGlyph({ size = 16 }) {
      return h(SvgIcon, { size, strokeWidth: 2 }, h('path', { d: 'M12 5v14M5 12h14' }))
    }

    function MinusGlyph({ size = 16 }) {
      return h(SvgIcon, { size, strokeWidth: 2 }, h('path', { d: 'M5 12h14' }))
    }

    function CloseGlyph({ size = 16 }) {
      return h(SvgIcon, { size, strokeWidth: 2 }, h('path', { d: 'm6 6 12 12M18 6 6 18' }))
    }

    function PanelGlyph({ size = 16, active = false, alert = false }) {
      return h('span', {
        style: {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          color: active ? 'var(--dsw-alias-brand-primary)' : 'currentColor',
        },
      },
      h(DumbbellGlyph, { size }),
      alert
        ? h('span', {
          'aria-hidden': true,
          style: {
            position: 'absolute',
            top: -2,
            right: -3,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--dsw-alias-state-warn-primary)',
            boxShadow: '0 0 0 1.5px var(--dsw-specific-sidebar-fill)',
          },
        })
        : null)
    }

    function SidebarPanelIcon({ store, owner }) {
      const state = useStore(store)
      const now = new Date(useNow(30000))
      const key = dateKey(now)
      const index = mondayIndex(now)
      const day = state.days[index]
      const progress = progressFor(state, key, index)
      const complete = progress.total > 0 && progress.done >= progress.total
      const alert = state.reminder.enabled
        && reminderDue(state.reminder.time, now)
        && day
        && day.exercises.length > 0
        && !complete
        && state.dismissedDate !== key
      return h(PanelGlyph, {
        size: owner && owner.size ? owner.size : 16,
        active: Boolean(owner && owner.active),
        alert,
      })
    }

    // ---------------------------------------------------------------------
    // Hooks
    // ---------------------------------------------------------------------

    function useNow(intervalMs) {
      const [now, setNow] = useState(() => Date.now())
      useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), intervalMs)
        return () => window.clearInterval(id)
      }, [intervalMs])
      return now
    }

    function useStore(store) {
      return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
    }

    function readNotificationPermission() {
      const Holder = typeof window !== 'undefined' ? window.Notification : undefined
      return Holder ? Holder.permission : 'unsupported'
    }

    function sendDesktopNotification(title, body, tag, onOpen) {
      const Holder = typeof window !== 'undefined' ? window.Notification : undefined
      if (!Holder || Holder.permission !== 'granted') return false
      try {
        const notice = new Holder(title, { body, tag, silent: false })
        if (typeof onOpen === 'function') {
          notice.onclick = () => {
            try { window.focus() } catch { /* no-op */ }
            try { onOpen() } catch { /* no-op */ }
            try { notice.close() } catch { /* no-op */ }
          }
        }
        return true
      } catch {
        return false
      }
    }

    function requestDesktopPermission() {
      const Holder = typeof window !== 'undefined' ? window.Notification : undefined
      if (!Holder) return Promise.resolve('unsupported')
      if (Holder.permission === 'granted') return Promise.resolve('granted')
      try {
        return Holder.requestPermission().catch(() => readNotificationPermission())
      } catch {
        return Promise.resolve(readNotificationPermission())
      }
    }

    // ---------------------------------------------------------------------
    // Page pieces
    // ---------------------------------------------------------------------

    function ProgressBar({ done, total, label }) {
      const percent = total > 0 ? Math.round((done / total) * 100) : 0
      return h('div', null,
        h('div', { className: 'fit-progress' , role: 'progressbar', 'aria-label': label, 'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': done },
          h('span', { style: { width: percent + '%' } })),
        h('div', { className: 'fit-progress-caption' },
          h('span', null, label),
          h('span', null, percent + '%')))
    }

    function WeekOverview({ state, today, t, locale }) {
      const monday = startOfWeek(today)
      const todayKey = dateKey(today)
      const cells = []
      for (let offset = 0; offset < 7; offset += 1) {
        const date = addDays(monday, offset)
        const index = offset
        const key = dateKey(date)
        const day = state.days[index]
        const progress = progressFor(state, key, index)
        const rest = !day || day.exercises.length === 0
        const isToday = key === todayKey
        const currentWeek = key <= todayKey
        let status = '—'
        let statusKind = 'idle'
        if (rest) {
          status = t('weekRest')
          statusKind = 'rest'
        } else if (progress.total > 0 && progress.done >= progress.total) {
          status = '✓'
          statusKind = 'complete'
        } else if (isToday || (currentWeek && state.checkins[key])) {
          status = progress.done + '/' + progress.total
          statusKind = isToday ? 'today' : 'partial'
        } else if (!currentWeek) {
          status = ''
          statusKind = 'future'
        }
        cells.push(h('div', {
          key,
          className: 'fit-week-cell',
          'data-today': isToday ? 'true' : 'false',
          'data-kind': statusKind,
          title: day ? day.title : '',
        },
        h('span', { className: 'fit-week-name' }, t(WEEKDAY_KEYS[index])),
        h('span', { className: 'fit-week-date' }, date.getDate()),
        h('span', { className: 'fit-week-status' }, status)))
      }
      return h('section', { className: 'fit-card fit-week-card', 'aria-label': t('weekOverview') },
        h('div', { className: 'fit-section-head' },
          h('h2', { className: 'fit-section-title' }, t('weekOverview')),
          h('span', { className: 'fit-section-hint' }, localeTag(locale).startsWith('zh') ? '周一 → 周日' : 'Mon → Sun')),
        h('div', { className: 'fit-week' }, cells))
    }

    function ExerciseCard({ exercise, sets, adjusted, state, todayKey, t, onToggle, onAdjust, onReset }) {
      const done = checkedCount(state, todayKey, exercise)
      const complete = done >= sets
      const buttons = []
      for (let index = 0; index < sets; index += 1) {
        const checked = Boolean(state.checkins[todayKey] && state.checkins[todayKey].exercises
          && state.checkins[todayKey].exercises[exercise.id]
          && state.checkins[todayKey].exercises[exercise.id][index])
        const aria = exercise.name + '，' + t('setLabel') + ' ' + (index + 1) + (t('setSuffix') ? ' ' + t('setSuffix') : '') + '，' + (checked ? t('done') : t('notDone'))
        buttons.push(h('button', {
          key: index,
          type: 'button',
          className: 'fit-set',
          'data-checked': checked ? 'true' : 'false',
          'aria-pressed': checked,
          'aria-label': aria,
          onClick: () => onToggle(exercise.id, index),
        }, checked ? h(CheckGlyph, { size: 16 }) : h('span', null, index + 1)))
      }
      return h('article', { className: 'fit-card fit-ex', 'data-complete': complete ? 'true' : 'false' },
        h('div', { className: 'fit-ex-head' },
          h('div', null,
            h('h3', { className: 'fit-ex-name' }, exercise.name, complete ? h('span', { className: 'fit-ex-done' }, h(CheckGlyph, { size: 13 })) : null),
            h('p', { className: 'fit-ex-dose' }, sets + ' ' + t('setsUnit') + ' × ' + exercise.reps)),
          h('span', { className: 'fit-ex-count' }, done + ' / ' + sets)),
        h('div', { className: 'fit-sets', role: 'group', 'aria-label': exercise.name }, buttons),
        h('div', { className: 'fit-ex-adjust' },
          h('div', { className: 'fit-stepper' },
            h('span', { className: 'fit-adjust-label', 'data-adjusted': adjusted ? 'true' : 'false' },
              adjusted ? t('todayAdjusted') : t('todaySets')),
            h('button', {
              type: 'button',
              className: 'fit-step-btn',
              'aria-label': t('removeSet'),
              title: t('removeSet'),
              disabled: sets <= 1,
              onClick: () => onAdjust(-1),
            }, h(MinusGlyph, { size: 13 })),
            h('span', { className: 'fit-adjust-count' }, sets),
            h('button', {
              type: 'button',
              className: 'fit-step-btn',
              'aria-label': t('addSet'),
              title: t('addSet'),
              disabled: sets >= 20,
              onClick: () => onAdjust(1),
            }, h(PlusGlyph, { size: 13 }))),
          adjusted
            ? h(React.Fragment, null,
              h('span', { className: 'fit-adjust-preset' }, t('presetLabel') + ' ' + exercise.sets + ' ' + t('setsUnit')),
              h('button', { type: 'button', className: 'fit-link', onClick: onReset }, t('resetPreset')))
            : null,
          h('span', { className: 'fit-adjust-only' }, t('todayOnly'))))
    }

    function TodayView({ store, state, t, locale, onEdit, onClear }) {
      const nowMs = useNow(30000)
      const now = new Date(nowMs)
      const todayKey = dateKey(now)
      const index = mondayIndex(now)
      const day = state.days[index]
      const progress = progressFor(state, todayKey, index)
      const rest = !day || day.exercises.length === 0
      const complete = progress.total > 0 && progress.done >= progress.total
      const next = nextTrainingDay(state, index)
      const summary = day
        ? day.exercises.length + ' ' + t('exercisesUnit') + ' · ' + t('totalSetsPrefix') + ' ' + progress.total + ' ' + t('setsUnit')
        : ''
      return h(React.Fragment, null,
        h('section', { className: 'fit-card fit-hero' },
          h('div', { className: 'fit-hero-top' },
            h('div', null,
              h('p', { className: 'fit-eyebrow' }, t('todayLabel') + ' · ' + formatLongDate(now, locale)),
              h('h2', { className: 'fit-hero-title' }, day ? day.title : t('restDay')),
              h('p', { className: 'fit-hero-meta' }, rest ? t('restMeta') : summary)),
            h('span', { className: 'fit-hero-icon' }, rest ? h(MoonGlyph, { size: 23 }) : h(DumbbellGlyph, { size: 23 }))),
          rest
            ? h('div', { className: 'fit-rest-block' },
              h('p', { className: 'fit-hint' }, t('restBody')),
              h('div', { className: 'fit-rest-next-row' },
                h('p', { className: 'fit-rest-next' },
                  next
                    ? t('nextTraining') + '：' + t(WEEKDAY_KEYS[next.dayIndex]) + ' · ' + next.day.title
                    : t('noNextTraining')),
                h('button', { type: 'button', className: 'fit-btn fit-btn-small', onClick: onEdit }, t('editToday'))))
            : h(React.Fragment, null,
              h(ProgressBar, {
                done: progress.done,
                total: progress.total,
                label: t('completed') + ' ' + progress.done + ' / ' + progress.total + ' ' + t('setsUnit'),
              }),
              complete
                ? h('div', { className: 'fit-success', role: 'status' }, h(CheckGlyph, { size: 16 }), h('span', null, t('allDone')))
                : h('p', { className: 'fit-hint fit-hero-hint' }, t('checkHint')))),
        h(WeekOverview, { state, today: now, t, locale }),
        rest
          ? null
          : h('section', { className: 'fit-section', 'aria-label': t('todayExercises') },
            h('div', { className: 'fit-section-head' },
              h('div', null,
                h('h2', { className: 'fit-section-title' }, t('todayExercises')),
                h('p', { className: 'fit-section-hint' }, t('adjustHint'))),
              progress.done > 0
                ? h('button', { type: 'button', className: 'fit-link', onClick: onClear }, t('clearToday'))
                : null),
            day.exercises.map((exercise) => {
              const override = state.checkins[todayKey] && state.checkins[todayKey].setCounts
                ? state.checkins[todayKey].setCounts[exercise.id]
                : undefined
              const sets = Number.isInteger(override) ? override : exercise.sets
              return h(ExerciseCard, {
                key: exercise.id,
                exercise,
                sets,
                adjusted: Number.isInteger(override) && override !== exercise.sets,
                state,
                todayKey,
                t,
                onToggle: (exerciseId, setIndex) => store.toggleSet(todayKey, exerciseId, setIndex),
                onAdjust: (delta) => store.adjustSets(todayKey, exercise.id, delta),
                onReset: () => store.setExerciseSets(todayKey, exercise.id, exercise.sets),
              })
            })),
        h('div', { className: 'fit-reminder-line' },
          h('span', { className: 'fit-reminder-line-icon' }, h(BellGlyph, { size: 16 })),
          h('span', { className: 'fit-reminder-line-text' },
            state.reminder.enabled
              ? t('reminderAt') + ' ' + state.reminder.time
              : t('reminderOff')),
          h('button', { type: 'button', className: 'fit-link', onClick: onEdit }, t('edit')))
      )
    }

    function WeekdayChip({ index, active, day, t, onSelect }) {
      const total = planTotal(day)
      return h('button', {
        type: 'button',
        className: 'fit-day-btn',
        'data-active': active ? 'true' : 'false',
        onClick: () => onSelect(index),
      },
      h('span', null, t(WEEKDAY_KEYS[index])),
      h('span', { className: 'fit-day-count' }, total > 0 ? total + ' ' + t('setsUnit') : t('weekRest')))
    }

    function ReminderSettings({ store, state, t }) {
      const [permission, setPermission] = useState(readNotificationPermission)
      const [tested, setTested] = useState(false)
      useEffect(() => {
        const sync = () => setPermission(readNotificationPermission())
        window.addEventListener('focus', sync)
        document.addEventListener('visibilitychange', sync)
        return () => {
          window.removeEventListener('focus', sync)
          document.removeEventListener('visibilitychange', sync)
        }
      }, [])
      const enable = useCallback(async () => {
        const next = await requestDesktopPermission()
        setPermission(next)
      }, [])
      const test = useCallback(() => {
        const sent = sendDesktopNotification(t('notifyTestTitle'), t('notifyTestBody'), 'dsh-fitness-test')
        setTested(sent)
      }, [t])
      return h('section', { className: 'fit-card fit-reminder' },
        h('div', { className: 'fit-reminder-head' },
          h('div', null,
            h('h2', { className: 'fit-section-title' }, t('reminderTitle')),
            h('p', { className: 'fit-section-hint' }, t('reminderBody'))),
          h('button', {
            type: 'button',
            className: 'fit-switch',
            role: 'switch',
            'aria-checked': state.reminder.enabled,
            'aria-label': t('reminderSwitch'),
            onClick: () => store.setReminder({ enabled: !state.reminder.enabled }),
          })),
        h('div', { className: 'fit-reminder-row' },
          h('label', { className: 'fit-field-label', htmlFor: 'fit-reminder-time' }, t('reminderTime')),
          h('input', {
            id: 'fit-reminder-time',
            className: 'fit-input fit-time',
            type: 'time',
            value: state.reminder.time,
            disabled: !state.reminder.enabled,
            onChange: (event) => {
              const value = event.target.value
              if (value) store.setReminder({ time: value })
            },
          })),
        h('div', { className: 'fit-reminder-row fit-reminder-row-top' },
          h('div', null,
            h('div', { className: 'fit-field-label' }, t('browserNotify')),
            h('p', { className: 'fit-section-hint' }, t('browserNotifyHint'))),
          permission === 'granted'
            ? h('div', { className: 'fit-notify-actions' },
              h('span', { className: 'fit-status-ok' }, h(CheckGlyph, { size: 13 }), t('notifyOn')),
              h('button', { type: 'button', className: 'fit-btn fit-btn-small', onClick: test }, t('notifyTest')))
            : permission === 'unsupported'
              ? h('span', { className: 'fit-section-hint' }, t('notifyUnsupported'))
              : permission === 'denied'
                ? h('span', { className: 'fit-status-warn' }, t('notifyDenied'))
                : h('button', { type: 'button', className: 'fit-btn fit-btn-small', onClick: enable }, t('notifyEnable'))),
        tested && permission === 'granted'
          ? h('p', { className: 'fit-section-hint', role: 'status' }, t('notifyTestBody'))
          : null)
    }

    function PlanView({ store, state, t, draft, setDraft, dirty, setDirty, selectedDay, setSelectedDay, onSaved }) {
      const [error, setError] = useState('')
      const [confirmReset, setConfirmReset] = useState(false)
      const day = draft[selectedDay] || { title: '', exercises: [] }

      const editDay = useCallback((change) => {
        setDraft((days) => days.map((item, index) => index === selectedDay ? change(item) : item))
        setDirty(true)
        setError('')
      }, [selectedDay, setDirty, setDraft])

      const setTitle = useCallback((title) => {
        editDay((item) => Object.assign({}, item, { title }))
      }, [editDay])

      const addExercise = useCallback(() => {
        editDay((item) => Object.assign({}, item, {
          exercises: item.exercises.concat([{ id: makeId('ex'), name: '', sets: 3, reps: '10' }]),
        }))
      }, [editDay])

      const updateExercise = useCallback((id, patch) => {
        editDay((item) => Object.assign({}, item, {
          exercises: item.exercises.map((exercise) => exercise.id === id
            ? Object.assign({}, exercise, patch)
            : exercise),
        }))
      }, [editDay])

      const removeExercise = useCallback((id) => {
        editDay((item) => Object.assign({}, item, {
          exercises: item.exercises.filter((exercise) => exercise.id !== id),
        }))
      }, [editDay])

      const validate = useCallback(() => {
        const cleaned = draft.map((item) => {
          const exercises = item.exercises.map((exercise) => ({
            id: exercise.id || makeId('ex'),
            name: String(exercise.name || '').trim(),
            sets: clampSets(exercise.sets),
            reps: String(exercise.reps || '').trim(),
          }))
          return {
            title: String(item.title || '').trim() || (exercises.length ? '训练日' : '休息日'),
            exercises,
          }
        })
        for (let index = 0; index < cleaned.length; index += 1) {
          for (const exercise of cleaned[index].exercises) {
            if (!exercise.name) return { error: t('errorName'), dayIndex: index }
            if (!exercise.reps) return { error: t('errorReps'), dayIndex: index }
          }
        }
        return { days: cleaned }
      }, [draft, t])

      const save = useCallback(() => {
        const result = validate()
        if (result.error) {
          setError(result.error)
          setSelectedDay(result.dayIndex)
          return
        }
        store.savePlan(result.days)
        setDraft(clone(result.days))
        setDirty(false)
        setError('')
        onSaved()
      }, [onSaved, setDirty, setSelectedDay, store, validate])

      const reset = useCallback(() => {
        setDraft(clone(DEFAULT_DAYS))
        setDirty(true)
        setConfirmReset(false)
        setError('')
      }, [setDirty, setDraft])

      const discard = useCallback(() => {
        setDraft(clone(state.days))
        setDirty(false)
        setError('')
      }, [setDraft, setDirty, state.days])

      return h('div', { className: 'fit-editor-layout' },
        h('aside', { className: 'fit-card fit-day-nav', 'aria-label': t('planHeading') },
          h('div', { className: 'fit-day-nav-head' },
            h('h2', { className: 'fit-section-title' }, t('planHeading')),
            h('p', { className: 'fit-section-hint' }, t('planHint'))),
          h('div', { className: 'fit-day-list' },
            draft.map((item, index) => h(WeekdayChip, {
              key: index,
              index,
              active: index === selectedDay,
              day: item,
              t,
              onSelect: setSelectedDay,
            })))),
        h('div', { className: 'fit-editor-main' },
          h('section', { className: 'fit-card fit-form-card' },
            h('div', { className: 'fit-form-head' },
              h('div', null,
                h('p', { className: 'fit-eyebrow' }, t(WEEKDAY_KEYS[selectedDay]) + ' · ' + t('planHeading')),
                h('h2', { className: 'fit-form-title' }, day.title || t('restDay'))),
              dirty ? h('span', { className: 'fit-dirty-dot' }, t('unsaved')) : null),
            h('label', { className: 'fit-field-label', htmlFor: 'fit-day-title' }, t('dayName')),
            h('input', {
              id: 'fit-day-title',
              className: 'fit-input fit-input-title',
              value: day.title,
              maxLength: 30,
              placeholder: t('dayNamePlaceholder'),
              onChange: (event) => setTitle(event.target.value),
            }),
            h('div', { className: 'fit-form-divider' }),
            day.exercises.length === 0
              ? h('div', { className: 'fit-empty' },
                h('div', { className: 'fit-empty-icon' }, h(MoonGlyph, { size: 22 })),
                h('h3', { className: 'fit-empty-title' }, t('restEditorTitle')),
                h('p', { className: 'fit-section-hint' }, t('restEditorBody')),
                h('button', { type: 'button', className: 'fit-btn fit-btn-small', onClick: addExercise },
                  h(PlusGlyph, { size: 14 }), t('addFirstExercise')))
              : h(React.Fragment, null,
                h('div', { className: 'fit-ex-col-head', 'aria-hidden': true },
                  h('span', null, t('exerciseName')),
                  h('span', null, t('setsLabel')),
                  h('span', null, t('repsLabel')),
                  h('span', null, '')),
                day.exercises.map((exercise) => h('div', { key: exercise.id, className: 'fit-ex-row' },
                  h('input', {
                    className: 'fit-input',
                    value: exercise.name,
                    maxLength: 40,
                    placeholder: t('exerciseNamePlaceholder'),
                    'aria-label': t('exerciseName'),
                    onChange: (event) => updateExercise(exercise.id, { name: event.target.value }),
                  }),
                  h('input', {
                    className: 'fit-input fit-input-number',
                    type: 'number',
                    min: 1,
                    max: 20,
                    value: exercise.sets,
                    'aria-label': t('setsLabel'),
                    onChange: (event) => updateExercise(exercise.id, { sets: event.target.value }),
                    onBlur: (event) => updateExercise(exercise.id, { sets: clampSets(event.target.value) }),
                  }),
                  h('input', {
                    className: 'fit-input',
                    value: exercise.reps,
                    maxLength: 20,
                    placeholder: t('repsPlaceholder'),
                    'aria-label': t('repsLabel'),
                    onChange: (event) => updateExercise(exercise.id, { reps: event.target.value }),
                  }),
                  h('button', {
                    type: 'button',
                    className: 'fit-icon-btn',
                    'aria-label': t('deleteExercise'),
                    title: t('deleteExercise'),
                    onClick: () => removeExercise(exercise.id),
                  }, h(TrashGlyph, { size: 15 })))),
                h('button', { type: 'button', className: 'fit-btn fit-add-ex', onClick: addExercise },
                  h(PlusGlyph, { size: 14 }), t('addExercise'))),
            error ? h('p', { className: 'fit-error', role: 'alert' }, error) : null,
            h('div', { className: 'fit-savebar' },
              h('div', { className: 'fit-savebar-left' },
                h('button', { type: 'button', className: 'fit-btn fit-btn-primary', onClick: save }, t('savePlan')),
                dirty ? h('button', { type: 'button', className: 'fit-link', onClick: discard }, t('discard')) : null,
                h('span', { className: 'fit-section-hint' }, t('weekPlanNote'))),
              h('div', { className: 'fit-savebar-right' },
                confirmReset
                  ? h(React.Fragment, null,
                    h('span', { className: 'fit-error' }, t('resetConfirm')),
                    h('button', { type: 'button', className: 'fit-btn fit-btn-small fit-btn-danger', onClick: reset }, t('confirm')),
                    h('button', { type: 'button', className: 'fit-btn fit-btn-small', onClick: () => setConfirmReset(false) }, t('cancel')))
                  : h('button', {
                    type: 'button',
                    className: 'fit-btn fit-btn-small',
                    onClick: () => setConfirmReset(true),
                  }, t('resetDefault'))))),
          h(ReminderSettings, { store, state, t })))
    }

    function RecordsView({ state, t, locale }) {
      const today = new Date()
      const todayKey = dateKey(today)
      const monday = startOfWeek(today)
      const weekKeys = []
      for (let offset = 0; offset < 7; offset += 1) weekKeys.push(dateKey(addDays(monday, offset)))
      const planned = state.days.filter((day) => day.exercises.length > 0).length
      let completedDays = 0
      let completedSets = 0
      for (const key of weekKeys) {
        const checkin = state.checkins[key]
        if (checkin) {
          completedSets += checkin.completedSets
          if (checkin.totalSets > 0 && checkin.completedSets >= checkin.totalSets) completedDays += 1
        }
      }
      const rows = []
      for (let offset = 0; offset < 14; offset += 1) {
        const date = addDays(today, -offset)
        const key = dateKey(date)
        const index = mondayIndex(date)
        const day = state.days[index]
        const checkin = state.checkins[key]
        const isToday = key === todayKey
        const current = progressFor(state, key, index)
        const rest = !day || day.exercises.length === 0
        const snapshotTotal = checkin ? checkin.totalSets : 0
        const snapshotDone = checkin ? checkin.completedSets : 0
        const total = isToday ? current.total : (checkin ? snapshotTotal : current.total)
        const done = Math.min(total, isToday ? current.done : snapshotDone)
        const complete = total > 0 && done >= total
        const title = checkin && checkin.title ? checkin.title : (day ? day.title : t('restDay'))
        let status = t('recordNoRecord')
        let stateKind = 'missed'
        if (rest) {
          status = t('recordRest')
          stateKind = 'rest'
        } else if (complete) {
          status = t('recordComplete')
          stateKind = 'complete'
        } else if (done > 0) {
          status = t('recordPartial')
          stateKind = 'partial'
        } else if (isToday) {
          status = t('recordToday')
          stateKind = 'today'
        }
        rows.push(h('div', { key, className: 'fit-card fit-record', 'data-kind': stateKind },
          h('div', { className: 'fit-record-date' },
            h('div', { className: 'fit-record-day' }, formatShortDate(date, locale)),
            h('div', { className: 'fit-record-weekday' }, t(WEEKDAY_KEYS[index]))),
          h('div', { className: 'fit-record-main' },
            h('div', { className: 'fit-record-title' }, title),
            h('div', { className: 'fit-record-meta' },
              status + (total > 0 ? ' · ' + done + ' / ' + total + ' ' + t('setsUnit') : ''))),
          h('div', { className: 'fit-record-bar', 'aria-hidden': true },
            h('span', { style: { width: total > 0 ? Math.round((done / total) * 100) + '%' : '0%' } }))))
      }
      return h(React.Fragment, null,
        h('section', { className: 'fit-card fit-records-summary' },
          h('div', { className: 'fit-section-head' },
            h('h2', { className: 'fit-section-title' }, t('recordsTitle')),
            h('span', { className: 'fit-section-hint' }, t('recordsHint'))),
          h('div', { className: 'fit-stats' },
            h('div', { className: 'fit-stat' },
              h('div', { className: 'fit-stat-num' }, completedDays + ' / ' + planned),
              h('div', { className: 'fit-stat-label' }, t('statDoneDays') + ' · ' + t('summaryPlanned'))),
            h('div', { className: 'fit-stat' },
              h('div', { className: 'fit-stat-num' }, completedSets),
              h('div', { className: 'fit-stat-label' }, t('statSets'))),
            h('div', { className: 'fit-stat' },
              h('div', { className: 'fit-stat-num' }, planned),
              h('div', { className: 'fit-stat-label' }, t('statPlannedDays'))))),
        h('div', { className: 'fit-records' }, rows),
        h('p', { className: 'fit-footnote' }, h(CalendarGlyph, { size: 14 }), t('localOnly')))
    }

    function ReminderDock({ store, t, openPanel }) {
      const state = useStore(store)
      const nowMs = useNow(30000)
      const now = new Date(nowMs)
      const todayKey = dateKey(now)
      const index = mondayIndex(now)
      const day = state.days[index]
      const progress = progressFor(state, todayKey, index)
      const rest = !day || day.exercises.length === 0
      const complete = progress.total > 0 && progress.done >= progress.total
      const visible = state.reminder.enabled
        && reminderDue(state.reminder.time, now)
        && !rest
        && !complete
        && state.dismissedDate !== todayKey
      if (!visible) return null
      const remaining = Math.max(0, progress.total - progress.done)
      const summary = day.title + ' · ' + t('remainingSets') + ' ' + remaining + ' ' + t('setsUnit')
      return h('div', { className: 'fit-dock', role: 'region', 'aria-label': t('dockTitle') },
        h('div', { className: 'fit-dock-card' },
          h('span', { className: 'fit-dock-icon' }, h(BellGlyph, { size: 17 })),
          h('div', { className: 'fit-dock-text' },
            h('div', { className: 'fit-dock-title' }, t('dockTitle')),
            h('div', { className: 'fit-dock-sub' }, summary)),
          h('button', {
            type: 'button',
            className: 'fit-dock-go',
            onClick: openPanel,
          }, t('goTrain')),
          h('button', {
            type: 'button',
            className: 'fit-dock-close',
            'aria-label': t('dismissToday'),
            title: t('dismissToday'),
            onClick: () => store.dismissFor(todayKey),
          }, h(CloseGlyph, { size: 14 }))))
    }

    function FitnessPage({ ctx, store, openPanel }) {
      const snapshot = useSyncExternalStore(
        (listener) => ctx.locale.subscribe(listener),
        () => ctx.locale.getSnapshot(),
        () => ctx.locale.getSnapshot(),
      )
      const locale = snapshot && snapshot.active ? snapshot.active : 'zh'
      const t = ctx.locale.bind(NS)
      const state = useStore(store)
      const [tab, setTab] = useState('today')
      const [draft, setDraft] = useState(null)
      const [dirty, setDirty] = useState(false)
      const [selectedDay, setSelectedDay] = useState(() => mondayIndex(new Date()))
      const [notice, setNotice] = useState('')
      const now = new Date(useNow(60000))
      const todayKey = dateKey(now)
      const currentIndex = mondayIndex(now)

      useEffect(() => {
        if (!notice) return undefined
        const id = window.setTimeout(() => setNotice(''), 2400)
        return () => window.clearTimeout(id)
      }, [notice])

      const go = useCallback((next) => {
        if (next === tab) return
        if (tab === 'plan' && dirty && typeof window !== 'undefined' && !window.confirm(t('discardConfirm'))) return
        setTab(next)
        if (next === 'plan') {
          setDraft(clone(state.days))
          setDirty(false)
          setSelectedDay(currentIndex)
        }
      }, [currentIndex, dirty, state.days, t, tab])

      const confirmClear = useCallback(() => {
        if (typeof window !== 'undefined' && !window.confirm(t('clearConfirm'))) return
        store.clearDate(todayKey)
      }, [store, t, todayKey])

      const saved = useCallback(() => setNotice(t('saved')), [t])

      const tabs = [
        { id: 'today', label: t('tabToday') },
        { id: 'plan', label: t('tabPlan') },
        { id: 'records', label: t('tabRecords') },
      ]

      const header = h('header', { className: 'fit-header' },
        h('div', null,
          h('p', { className: 'fit-eyebrow' }, t('pageEyebrow')),
          h('h1', { className: 'fit-title' }, t('pageTitle')),
          h('p', { className: 'fit-subtitle' }, t('pageSubtitle'))),
        h('div', { className: 'fit-date-chip' },
          h(CalendarGlyph, { size: 14 }),
          h('span', null, formatLongDate(now, locale))))

      const nav = h('nav', { className: 'fit-tabs', role: 'tablist', 'aria-label': t('panel') },
        tabs.map((item) => h('button', {
          key: item.id,
          type: 'button',
          role: 'tab',
          className: 'fit-tab',
          'aria-selected': tab === item.id,
          onClick: () => go(item.id),
        }, item.label)))

      const body = tab === 'today'
        ? h(TodayView, { store, state, t, locale, onEdit: () => go('plan'), onClear: confirmClear })
        : tab === 'plan' && draft
          ? h(PlanView, {
            store,
            state,
            t,
            draft,
            setDraft,
            dirty,
            setDirty,
            selectedDay,
            setSelectedDay,
            onSaved: saved,
          })
          : tab === 'records'
            ? h(RecordsView, { state, t, locale })
            : null

      const shell = h('div', { className: 'fit-shell' },
        header,
        nav,
        body,
        h('div', { className: 'fit-page-foot' },
          h('span', null, t('localOnly'))),
        notice ? h('div', { className: 'fit-toast', role: 'status' }, notice) : null)

      return h('div', { className: 'fit-page' }, shell)
    }

    // ---------------------------------------------------------------------
    // Styles — theme tokens only, all classes prefixed with fit-
    // ---------------------------------------------------------------------

    const CSS = `
.fit-page{box-sizing:border-box;height:100%;overflow-y:auto;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);padding:calc(30px + var(--dsh-frame-top-clearance,0px)) 28px 64px;font-size:14px;line-height:1.45}
.fit-page *{box-sizing:border-box}
.fit-shell{width:100%;max-width:980px;margin:0 auto}
.fit-header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:24px}
.fit-eyebrow{margin:0;font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--dsw-alias-label-secondary)}
.fit-title{margin:7px 0 5px;font-size:27px;line-height:1.25;font-weight:650;letter-spacing:-.01em}
.fit-subtitle{margin:0;font-size:13px;color:var(--dsw-alias-label-secondary)}
.fit-date-chip{display:inline-flex;align-items:center;gap:7px;flex:none;padding:8px 11px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-size:12px;white-space:nowrap}
.fit-tabs{display:flex;gap:2px;border-bottom:1px solid var(--dsw-alias-border-l1);margin-bottom:22px}
.fit-tab{appearance:none;background:none;border:0;border-bottom:2px solid transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit;font-size:13px;font-weight:500;padding:10px 14px;margin-bottom:-1px;transition:color .15s ease,border-color .15s ease}
.fit-tab:hover{color:var(--dsw-alias-label-primary)}
.fit-tab[aria-selected="true"]{color:var(--dsw-alias-label-primary);border-bottom-color:var(--dsw-alias-brand-primary);font-weight:600}
.fit-tab:focus-visible,.fit-btn:focus-visible,.fit-link:focus-visible,.fit-set:focus-visible,.fit-day-btn:focus-visible,.fit-icon-btn:focus-visible,.fit-switch:focus-visible,.fit-dock-go:focus-visible,.fit-dock-close:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.fit-card{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;padding:20px}
.fit-hero{padding:22px 24px;margin-bottom:14px}
.fit-hero-top{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}
.fit-hero-title{margin:4px 0 4px;font-size:23px;line-height:1.3;font-weight:650;letter-spacing:-.01em}
.fit-hero-meta{margin:0;font-size:13px;color:var(--dsw-alias-label-secondary)}
.fit-hero-icon{display:inline-flex;align-items:center;justify-content:center;flex:none;width:44px;height:44px;border-radius:12px;color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1)}
.fit-progress{height:8px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);overflow:hidden;margin-top:18px}
.fit-progress>span{display:block;height:100%;border-radius:inherit;background:var(--dsw-alias-brand-primary);transition:width .2s ease}
.fit-progress-caption{display:flex;justify-content:space-between;gap:12px;margin-top:8px;font-size:11.5px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.fit-hero-hint{margin-top:10px}
.fit-hint{margin:0;font-size:12px;line-height:1.55;color:var(--dsw-alias-label-secondary)}
.fit-success{display:flex;align-items:center;gap:8px;margin-top:15px;padding:10px 12px;border-radius:9px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-state-success-primary);font-size:12.5px;font-weight:500}
.fit-rest-block{margin-top:16px;padding-top:14px;border-top:1px solid var(--dsw-alias-border-l1)}
.fit-rest-next-row{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:10px}
.fit-rest-next{margin:0;font-size:12.5px;color:var(--dsw-alias-label-secondary)}
.fit-week-card{padding:17px 20px 18px}
.fit-section-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:11px}
.fit-section-title{margin:0;font-size:14.5px;font-weight:600;line-height:1.4}
.fit-section-hint{margin:3px 0 0;font-size:11.5px;line-height:1.5;color:var(--dsw-alias-label-secondary)}
.fit-week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px}
.fit-week-cell{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 4px 7px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-base)}
.fit-week-cell[data-today="true"]{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2)}
.fit-week-name{font-size:10.5px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.fit-week-date{font-size:15px;font-weight:600;font-variant-numeric:tabular-nums}
.fit-week-status{min-height:15px;font-size:10.5px;font-weight:600;line-height:15px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.fit-week-cell[data-kind="rest"] .fit-week-status{color:var(--dsw-alias-state-idle-primary)}
.fit-week-cell[data-kind="complete"] .fit-week-status{color:var(--dsw-alias-state-success-primary)}
.fit-week-cell[data-kind="today"] .fit-week-status,.fit-week-cell[data-kind="partial"] .fit-week-status{color:var(--dsw-alias-brand-primary)}
.fit-week-cell[data-kind="future"] .fit-week-status{color:var(--dsw-alias-state-idle-primary)}
.fit-section{margin-top:22px}
.fit-ex{padding:16px 18px;margin-bottom:9px}
.fit-ex[data-complete="true"]{border-color:var(--dsw-alias-border-l2)}
.fit-ex-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:13px}
.fit-ex-name{display:flex;align-items:center;gap:6px;margin:0;font-size:14.5px;font-weight:600;line-height:1.35}
.fit-ex-done{display:inline-flex;color:var(--dsw-alias-state-success-primary)}
.fit-ex-dose{margin:3px 0 0;font-size:11.5px;color:var(--dsw-alias-label-secondary)}
.fit-ex-count{flex:none;font-size:11.5px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;padding-top:1px}
.fit-sets{display:flex;flex-wrap:wrap;gap:7px}
.fit-set{appearance:none;display:inline-flex;align-items:center;justify-content:center;width:43px;height:39px;padding:0;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);cursor:pointer;font:inherit;font-size:12.5px;font-weight:600;font-variant-numeric:tabular-nums;transition:background .15s ease,border-color .15s ease,color .15s ease}
.fit-set:hover{border-color:var(--dsw-alias-brand-primary)}
.fit-set[data-checked="true"]{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-brand-primary);box-shadow:inset 0 0 0 1px var(--dsw-alias-brand-primary)}
.fit-ex-adjust{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:11px;padding-top:10px;border-top:1px dashed var(--dsw-alias-border-l1);font-size:10.5px;color:var(--dsw-alias-label-secondary)}
.fit-stepper{display:flex;align-items:center;gap:6px}
.fit-adjust-label{font-weight:600}
.fit-adjust-label[data-adjusted="true"]{color:var(--dsw-alias-brand-primary)}
.fit-adjust-count{min-width:15px;text-align:center;font-size:11.5px;font-weight:600;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}
.fit-adjust-preset{font-variant-numeric:tabular-nums}
.fit-step-btn{appearance:none;display:inline-flex;align-items:center;justify-content:center;width:23px;height:23px;padding:0;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);cursor:pointer}
.fit-step-btn:hover:not(:disabled){border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}
.fit-step-btn:disabled{opacity:.35;cursor:not-allowed}
.fit-adjust-only{margin-left:auto;color:var(--dsw-alias-state-idle-primary)}
.fit-reminder-line{display:flex;align-items:center;gap:8px;margin-top:20px;padding:12px 14px;border:1px solid var(--dsw-alias-border-l1);border-radius:11px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-size:12px}
.fit-reminder-line-icon{display:inline-flex;color:var(--dsw-alias-label-secondary)}
.fit-reminder-line-text{flex:1;min-width:0}
.fit-link{appearance:none;border:0;background:none;color:var(--dsw-alias-brand-primary);cursor:pointer;font:inherit;font-size:12px;font-weight:500;padding:2px 0;text-decoration:none}
.fit-link:hover{text-decoration:underline}
.fit-editor-layout{display:grid;grid-template-columns:210px minmax(0,1fr);gap:14px;align-items:start}
.fit-day-nav{padding:14px}
.fit-day-nav-head{padding:2px 4px 10px}
.fit-day-list{display:flex;flex-direction:column;gap:2px}
.fit-day-btn{appearance:none;display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:9px 10px;border:0;border-radius:7px;background:none;color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit;font-size:12.5px;text-align:left}
.fit-day-btn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.fit-day-btn[data-active="true"]{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary);font-weight:600}
.fit-day-count{font-size:10.5px;font-weight:400;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.fit-day-btn[data-active="true"] .fit-day-count{color:var(--dsw-alias-brand-primary)}
.fit-editor-main{min-width:0}
.fit-form-card{padding:20px}
.fit-form-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:15px}
.fit-form-title{margin:3px 0 0;font-size:19px;line-height:1.3;font-weight:650}
.fit-dirty-dot{flex:none;padding:3px 8px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-state-warn-primary);font-size:10.5px;font-weight:600}
.fit-field-label{display:block;margin-bottom:5px;font-size:11.5px;font-weight:600;color:var(--dsw-alias-label-primary)}
.fit-input{width:100%;min-width:0;padding:8px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12.5px;line-height:1.4;outline:none}
.fit-input::placeholder{color:var(--dsw-alias-state-idle-primary)}
.fit-input:focus{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-2)}
.fit-input:disabled{opacity:.55;cursor:not-allowed}
.fit-input-title{font-size:14px;font-weight:600;padding:9px 11px}
.fit-form-divider{height:1px;background:var(--dsw-alias-border-l1);margin:16px 0 13px}
.fit-empty{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;padding:26px 16px;border:1px dashed var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-base)}
.fit-empty-icon{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;margin-bottom:4px;border-radius:10px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary)}
.fit-empty-title{margin:0;font-size:13.5px;font-weight:600}
.fit-ex-col-head{display:grid;grid-template-columns:minmax(0,1fr) 76px 104px 28px;gap:7px;padding:0 0 6px;font-size:10.5px;font-weight:600;letter-spacing:.02em;color:var(--dsw-alias-label-secondary)}
.fit-ex-row{display:grid;grid-template-columns:minmax(0,1fr) 76px 104px 28px;gap:7px;align-items:center;padding:3px 0}
.fit-input-number{text-align:center;font-variant-numeric:tabular-nums}
.fit-icon-btn{appearance:none;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:6px;background:none;color:var(--dsw-alias-label-secondary);cursor:pointer}
.fit-icon-btn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-state-error-primary)}
.fit-btn{appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:5px;height:33px;padding:0 13px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);cursor:pointer;font:inherit;font-size:12px;font-weight:500;white-space:nowrap;transition:background .15s ease,border-color .15s ease}
.fit-btn:hover{background:var(--dsw-alias-bg-layer-2)}
.fit-btn-primary{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-base);font-weight:600}
.fit-btn-primary:hover{background:var(--dsw-alias-brand-primary);opacity:.9}
.fit-btn-small{height:28px;padding:0 9px;font-size:11px}
.fit-btn-danger{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}
.fit-add-ex{margin-top:9px}
.fit-error{margin:8px 0 0;font-size:11.5px;line-height:1.5;color:var(--dsw-alias-state-error-primary)}
.fit-savebar{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-top:16px;padding-top:15px;border-top:1px solid var(--dsw-alias-border-l1)}
.fit-savebar-left,.fit-savebar-right{display:flex;align-items:center;flex-wrap:wrap;gap:8px}
.fit-savebar-left .fit-section-hint{flex-basis:100%;margin-top:-1px}
.fit-reminder{margin-top:14px}
.fit-reminder-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:8px}
.fit-reminder-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 0 0;margin-top:6px;border-top:1px solid var(--dsw-alias-border-l1)}
.fit-reminder-row-top{align-items:flex-start;flex-wrap:wrap}
.fit-time{width:118px;flex:none;font-variant-numeric:tabular-nums}
.fit-switch{position:relative;flex:none;width:40px;height:22px;margin-top:2px;padding:0;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-2);cursor:pointer;transition:background .15s ease,border-color .15s ease}
.fit-switch:after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-label-secondary);transition:transform .15s ease,background .15s ease}
.fit-switch[aria-checked="true"]{background:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary)}
.fit-switch[aria-checked="true"]:after{transform:translateX(18px);background:var(--dsw-alias-bg-base)}
.fit-notify-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end}
.fit-status-ok{display:inline-flex;align-items:center;gap:4px;color:var(--dsw-alias-state-success-primary);font-size:11.5px;font-weight:600}
.fit-status-warn{max-width:260px;color:var(--dsw-alias-state-warn-primary);font-size:11px;line-height:1.45;text-align:right}
.fit-records-summary{padding:18px 20px;margin-bottom:13px}
.fit-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:13px}
.fit-stat{padding:12px 13px;border-radius:9px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1)}
.fit-stat-num{font-size:21px;font-weight:650;line-height:1.2;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.fit-stat-label{margin-top:3px;font-size:10.5px;color:var(--dsw-alias-label-secondary)}
.fit-record{display:flex;align-items:center;gap:14px;padding:12px 15px;margin-bottom:7px}
.fit-record-date{flex:none;width:58px}
.fit-record-day{font-size:12.5px;font-weight:600;font-variant-numeric:tabular-nums}
.fit-record-weekday{font-size:10.5px;color:var(--dsw-alias-label-secondary);margin-top:1px}
.fit-record-main{flex:1;min-width:0}
.fit-record-title{font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fit-record-meta{font-size:10.5px;color:var(--dsw-alias-label-secondary);margin-top:2px;font-variant-numeric:tabular-nums}
.fit-record[data-kind="complete"] .fit-record-meta{color:var(--dsw-alias-state-success-primary)}
.fit-record[data-kind="partial"] .fit-record-meta{color:var(--dsw-alias-brand-primary)}
.fit-record[data-kind="missed"] .fit-record-title{color:var(--dsw-alias-label-secondary)}
.fit-record-bar{flex:none;width:82px;height:5px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);overflow:hidden}
.fit-record-bar>span{display:block;height:100%;border-radius:inherit;background:var(--dsw-alias-brand-primary)}
.fit-record[data-kind="complete"] .fit-record-bar>span{background:var(--dsw-alias-state-success-primary)}
.fit-footnote{display:flex;align-items:center;gap:6px;margin:14px 2px 0;font-size:10.5px;color:var(--dsw-alias-label-secondary)}
.fit-page-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:22px;font-size:10.5px;color:var(--dsw-alias-label-secondary)}
.fit-toast{position:fixed;left:50%;bottom:92px;transform:translateX(-50%);z-index:40;padding:9px 14px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);font-size:12px;box-shadow:0 8px 24px var(--dsw-alias-border-l1)}
.fit-dock{position:fixed;right:24px;bottom:96px;z-index:40;pointer-events:none}
.fit-dock-card{pointer-events:auto;display:flex;align-items:center;gap:10px;width:min(372px,calc(100vw - 32px));padding:11px 11px 11px 13px;border:1px solid var(--dsw-alias-border-l2);border-radius:13px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 10px 30px var(--dsw-alias-border-l1)}
.fit-dock-icon{display:inline-flex;align-items:center;justify-content:center;flex:none;width:31px;height:31px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}
.fit-dock-text{flex:1;min-width:0}
.fit-dock-title{font-size:12.5px;font-weight:600;line-height:1.35}
.fit-dock-sub{margin-top:2px;font-size:10.5px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fit-dock-go{appearance:none;flex:none;height:28px;padding:0 10px;border:1px solid var(--dsw-alias-brand-primary);border-radius:7px;background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-base);cursor:pointer;font:inherit;font-size:11px;font-weight:600;white-space:nowrap}
.fit-dock-close{appearance:none;display:inline-flex;align-items:center;justify-content:center;flex:none;width:25px;height:25px;padding:0;border:0;border-radius:6px;background:none;color:var(--dsw-alias-label-secondary);cursor:pointer}
.fit-dock-close:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
@media (max-width:820px){.fit-editor-layout{grid-template-columns:1fr}.fit-day-nav{overflow-x:auto}.fit-day-list{flex-direction:row}.fit-day-btn{flex:none;min-width:96px}.fit-day-nav-head{padding-bottom:8px}}
@media (max-width:640px){.fit-page{padding:calc(20px + var(--dsh-frame-top-clearance,0px)) 14px 80px}.fit-status-warn{max-width:none;text-align:left}.fit-adjust-only{margin-left:0}.fit-header{flex-direction:column;gap:11px}.fit-date-chip{align-self:flex-start}.fit-title{font-size:23px}.fit-hero{padding:18px}.fit-hero-title{font-size:20px}.fit-week{gap:4px}.fit-week-cell{padding:7px 2px}.fit-week-name{font-size:9.5px}.fit-form-card{padding:15px}.fit-ex-col-head,.fit-ex-row{grid-template-columns:minmax(0,1fr) 54px 74px 26px;gap:5px}.fit-savebar{flex-direction:column;align-items:stretch}.fit-savebar-right{justify-content:flex-end}.fit-record-bar{width:46px}.fit-stats{gap:6px}.fit-stat{padding:10px}.fit-dock{left:12px;right:12px;bottom:80px}.fit-dock-card{width:100%}}
`

    // ---------------------------------------------------------------------
    // Plugin definition
    // ---------------------------------------------------------------------

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        const store = createStore()
        stateStore = store

        ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'fitness-plan: dictionaries')
        const t = ctx.locale.bind(NS)

        ctx.effect(() => {
          const tag = document.createElement('style')
          tag.dataset.dshFitnessPlan = 'style'
          tag.textContent = CSS
          document.head.append(tag)
          return () => tag.remove()
        }, 'fitness-plan: styles')

        let layoutService
        ctx.inject(['layout'], (scoped) => {
          layoutService = scoped.layout
        })

        const openPanel = () => {
          try {
            const service = layoutService || (typeof ctx.get === 'function' ? ctx.get('layout') : undefined)
            if (service && typeof service.selectPanel === 'function') service.selectPanel(PANEL_ID)
          } catch {
            // Navigation is a convenience; never let it break the reminder.
          }
        }

        function checkReminder() {
          try {
            const state = store.getSnapshot()
            if (!state.reminder.enabled) return
            const now = new Date()
            const key = dateKey(now)
            if (state.notifiedDate === key || state.dismissedDate === key) return
            const index = mondayIndex(now)
            const day = state.days[index]
            if (!day || day.exercises.length === 0) return
            const progress = progressFor(state, key, index)
            if (progress.total === 0 || progress.done >= progress.total) return
            if (!reminderDue(state.reminder.time, now)) return
            // The in-page dock is the reminder while the app is visible. Only
            // reach for an OS notification once the page is in the background.
            if (document.visibilityState === 'visible') return
            store.markNotified(key)
            const body = day.title + ' · ' + t('remainingSets') + ' ' + (progress.total - progress.done) + ' ' + t('setsUnit')
            sendDesktopNotification(t('notifyTitle'), body, 'dsh-fitness-' + key, openPanel)
          } catch (error) {
            console.warn('[fitness-plan] reminder check failed:', error)
          }
        }

        ctx.effect(() => {
          checkReminder()
          const id = window.setInterval(checkReminder, 30000)
          return () => window.clearInterval(id)
        }, 'fitness-plan: reminder timer')

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_ID,
        }, () => h(FitnessPage, { ctx, store, openPanel })))

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 2,
          label: () => t('panel'),
        }, (owner) => h(SidebarPanelIcon, { store, owner })))

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'fitness-plan-reminder',
          order: 50,
        }, () => h(ReminderDock, { store, t, openPanel })))
      },
    }
  },
})
