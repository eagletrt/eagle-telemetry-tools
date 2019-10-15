#!/bin/bash

if [ $1 = "vcan0" ]
    then
        echo "Setting up vcan0..."
        sudo modprobe vcan
        sudo ip link add dev vcan0 type vcan
        sudo ifconfig vcan0 up
        echo "Set Up Done :)"
    else
        echo "Setting up can0..."
        sudo modprobe can
        sudo ip link add dev vcan0 type can
        sudo ifconfig can0 up
        echo "Set Up Done :)"
fi



