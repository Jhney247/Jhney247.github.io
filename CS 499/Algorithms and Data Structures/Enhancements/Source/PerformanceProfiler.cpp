#include "PerformanceProfiler.h"
#include <iostream>
#include <iomanip>

PerformanceProfiler& PerformanceProfiler::getInstance()
{
    static PerformanceProfiler instance;
    return instance;
}

PerformanceProfiler::PerformanceProfiler()
    : m_fps(0.0f)
    , m_frameTime(0.0f)
    , m_objectCount(0)
    , m_drawCalls(0)
    , m_visibleObjects(0)
    , m_frameCount(0)
    , m_totalFrameTime(0.0)
    , m_totalFrames(0)
{
}

PerformanceProfiler::~PerformanceProfiler()
{
}

void PerformanceProfiler::startFrame()
{
    m_frameStart = std::chrono::high_resolution_clock::now();
    m_drawCalls = 0;
}

void PerformanceProfiler::endFrame()
{
    m_frameEnd = std::chrono::high_resolution_clock::now();
    
    std::chrono::duration<double, std::milli> duration = m_frameEnd - m_frameStart;
    m_frameTime = static_cast<float>(duration.count());
    
    if (m_frameTime > 0.0f)
    {
        m_fps = 1000.0f / m_frameTime;
    }
    
    m_totalFrameTime += m_frameTime;
    m_totalFrames++;
    m_frameCount++;
}

void PerformanceProfiler::recordObjectCount(int count)
{
    m_objectCount = count;
}

void PerformanceProfiler::recordDrawCall()
{
    m_drawCalls++;
}

void PerformanceProfiler::recordVisibleObjects(int count)
{
    m_visibleObjects = count;
}

void PerformanceProfiler::startSection(const std::string& name)
{
    m_sections[name].start = std::chrono::high_resolution_clock::now();
}

void PerformanceProfiler::endSection(const std::string& name)
{
    auto& section = m_sections[name];
    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> duration = end - section.start;
    section.totalTime += duration.count();
    section.callCount++;
}

void PerformanceProfiler::logToFile(const std::string& filename)
{
    std::ofstream file(filename, std::ios::app);
    if (!file.is_open())
        return;
    
    file << "=== Performance Report ===\n";
    file << "Frame: " << m_frameCount << "\n";
    file << "FPS: " << std::fixed << std::setprecision(2) << m_fps << "\n";
    file << "Frame Time: " << m_frameTime << " ms\n";
    file << "Total Objects: " << m_objectCount << "\n";
    file << "Visible Objects: " << m_visibleObjects << "\n";
    file << "Draw Calls: " << m_drawCalls << "\n";
    
    if (m_totalFrames > 0)
    {
        file << "Average Frame Time: " << (m_totalFrameTime / m_totalFrames) << " ms\n";
        file << "Average FPS: " << (1000.0 / (m_totalFrameTime / m_totalFrames)) << "\n";
    }
    
    file << "\nSection Timings:\n";
    for (const auto& pair : m_sections)
    {
        const std::string& name = pair.first;
        const SectionTimer& timer = pair.second;
        if (timer.callCount > 0)
        {
            double avgTime = timer.totalTime / timer.callCount;
            file << "  " << name << ": " << avgTime << " ms (avg over " << timer.callCount << " calls)\n";
        }
    }
    
    file << "\n";
    file.close();
}

void PerformanceProfiler::logToConsole()
{
    std::cout << "\n=== Performance Stats ===\n";
    std::cout << "FPS: " << std::fixed << std::setprecision(2) << m_fps << "\n";
    std::cout << "Frame Time: " << m_frameTime << " ms\n";
    std::cout << "Total Objects: " << m_objectCount << "\n";
    std::cout << "Visible Objects: " << m_visibleObjects << " (culled: " << (m_objectCount - m_visibleObjects) << ")\n";
    std::cout << "Draw Calls: " << m_drawCalls << "\n";
    
    if (m_totalFrames > 0)
    {
        std::cout << "Average Frame Time: " << (m_totalFrameTime / m_totalFrames) << " ms\n";
        std::cout << "Average FPS: " << (1000.0 / (m_totalFrameTime / m_totalFrames)) << "\n";
    }
    std::cout << "========================\n\n";
}

void PerformanceProfiler::reset()
{
    m_totalFrameTime = 0.0;
    m_totalFrames = 0;
    m_frameCount = 0;
    m_sections.clear();
}
